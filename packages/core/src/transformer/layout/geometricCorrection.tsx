import {
  ColumnSeparatorLabel,
  Label,
  LayoutData,
  LayoutVariationArrow,
  Point,
  Segment,
  VerticalPosition,
} from "../types";
import { getLabelBounds, getRectCenter, getSegmentRectIntersection, shortenSegment } from "./geometry";
import { testGeometry } from "./geometry.test";

function findColumnSeparatorLabel(
  labels: Map<string, Label>,
  row: number,
  columnSeparatorIndex: number,
  vPosition: VerticalPosition,
  excludeHPosition: "left" | "right"
): ColumnSeparatorLabel | undefined {
  for (const label of labels.values()) {
    if (label.role !== "columnSeparatorLabel") continue;
    if (label.row !== row) continue;
    if (label.columnSeparatorIndex !== columnSeparatorIndex) continue;
    if (label.vPosition !== vPosition) continue;
    if (label.hPosition === excludeHPosition) continue;
    return label;
  }
  return undefined;
}

function getArrowLabelVPositions(arrow: LayoutVariationArrow): {
  startVPos: VerticalPosition;
  endVPos: VerticalPosition;
} {
  switch (arrow.type) {
    case "increasing":
      return { startVPos: "bottom", endVPos: "top" };
    case "decreasing":
      return { startVPos: "top", endVPos: "bottom" };
    default: // "constant":
      return {
        startVPos: arrow.vPosition ?? "center",
        endVPos: arrow.vPosition ?? "center",
      };
  }
}

function correctArrowPath(
  arrow: LayoutVariationArrow,
  labels: Map<string, Label>
): Segment {
  const { startVPos, endVPos } = getArrowLabelVPositions(arrow);

  // hPosition 'left' at the start node belongs to the segment BEFORE this
  // node (not the one this arrow is leaving from), so it's excluded.
  const startLabel = findColumnSeparatorLabel(
    labels,
    arrow.row,
    arrow.columnSeparatorStart,
    startVPos,
    "left"
  );
  // symmetrically, hPosition 'right' at the end node belongs to the segment
  // AFTER this node, not the one this arrow is arriving at.
  const endLabel = findColumnSeparatorLabel(
    labels,
    arrow.row,
    arrow.columnSeparatorEnd,
    endVPos,
    "right"
  );

  const startBounds = startLabel ? getLabelBounds(startLabel) : null;
  const endBounds = endLabel ? getLabelBounds(endLabel) : null;

  const startCenter = startBounds
    ? getRectCenter(startBounds)
    : arrow.originalPath.start;
  const endCenter = endBounds
    ? getRectCenter(endBounds)
    : arrow.originalPath.end;

  const startPoint: Point | null = startBounds ? getSegmentRectIntersection({start : startCenter, end:endCenter}, startBounds) : null ;
  const endPoint: Point | null = endBounds ? getSegmentRectIntersection({start : startCenter, end:endCenter}, endBounds) : null ;
  const path = { start: startPoint??startCenter, end: endPoint??endCenter };
  return shortenSegment(path, 2);
}

export function geometricCorrection(
  layoutData: LayoutData,
  labels: Map<string, Label>
): LayoutData {
  const layout: LayoutData = {
    id: layoutData.id,
    config: { ...layoutData.config },
    width: layoutData.width,
    height: layoutData.height,
    rowLabels: [...layoutData.rowLabels],
    columnHeaders: [...layoutData.columnHeaders],
    lineContents: [...layoutData.lineContents],
    columnSeparatorLabels: [...layoutData.columnSeparatorLabels],
    intermediateImages: [...layoutData.intermediateImages],
    intermediateAntecedents: [...layoutData.intermediateAntecedents],
    columnSeparators: [...layoutData.columnSeparators],
    variationArrows: [...layoutData.variationArrows],
    forbiddenRegions: [...layoutData.forbiddenRegions],
    grid: [...layoutData.grid],
  };

  layout.variationArrows = layout.variationArrows.map((arrow) => ({
    ...arrow,
    correctedPath: correctArrowPath(arrow, labels),
  }));

  return layout;
}
