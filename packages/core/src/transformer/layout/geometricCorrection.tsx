import { ColumnSeparatorLabel, Label, LayoutData, LayoutVariationArrow, Point, Segment, VerticalPosition } from "../types";



function getLabelCenter(label: Label): Point {
    if(!(label.measuredWidth && label.measuredHeight)){
        return {...label.anchor};
    }

  const w = label.measuredWidth ?? 0;
  const h = label.measuredHeight ?? 0;
  const { x, y } = label.anchor;

  const cx = label.hPosition === "left" ? x - w/2 : label.hPosition === "right" ? x+w/2 : x ;

  const cy = label.vPosition === "top" ? y+h/2 : label.vPosition === "bottom" ? y - h/2 : y;
  return { x:cx,y:cy };
}


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

// startVPos/endVPos: which vertical position (top/bottom) the label attached
// to the arrow's start/end node is expected to sit at, given the arrow's
// direction. Mirrors the vertical placement chosen in processTkzTabVar.
function getArrowLabelVPositions(arrow: LayoutVariationArrow): { startVPos: VerticalPosition; endVPos: VerticalPosition } {
  switch (arrow.type) {
    case "increasing":
      return { startVPos: "bottom", endVPos: "top" };
    case "decreasing":
      return { startVPos: "top", endVPos: "bottom" };
    default : // "constant":
      return { startVPos: arrow.vPosition??'center', endVPos: arrow.vPosition??'center' };
  }
}

function correctArrowPath(arrow: LayoutVariationArrow, labels: Map<string, Label>): Segment {
  const { startVPos, endVPos } = getArrowLabelVPositions(arrow);

  // hPosition 'left' at the start node belongs to the segment BEFORE this
  // node (not the one this arrow is leaving from), so it's excluded.
  const startLabel = findColumnSeparatorLabel(
    labels, arrow.row, arrow.columnSeparatorStart, startVPos, "left"
  );
  // symmetrically, hPosition 'right' at the end node belongs to the segment
  // AFTER this node, not the one this arrow is arriving at.
  const endLabel = findColumnSeparatorLabel(
    labels, arrow.row, arrow.columnSeparatorEnd, endVPos, "right"
  );

  const start = startLabel ? getLabelCenter(startLabel)  : arrow.originalPath.start;
  const end = endLabel ? getLabelCenter(endLabel)  : arrow.originalPath.end;
  return { start, end}
}

export function geometricCorrection(layoutData: LayoutData, labels: Map<string, Label>): LayoutData {
  const layout: LayoutData = {
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