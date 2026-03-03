import type { ReactElement } from "react";
import {
  VariationType,
  type TableData,
  type VariationArrow,
  type VerticalPosition,
} from "../../models/TableData";
import type { LabelGeometry, MeasuredData } from "../../VariationTable";
import { ArrowHeadId } from "./ArrowHeadDef";

export function VariationArrows({
  tableData,
  labelGeometry,
}: {
  tableData: TableData;
  labelGeometry: MeasuredData["labelGeometry"];
}) {
  /* previousEndPosition is used
     to position a CONST arrow based on the previous one
  */
  let previousEndPosition: VerticalPosition | null = null;

  const arrows: ReactElement<SVGLineElement>[] = tableData.variationArrows.map(
    (arrow: VariationArrow, i: number) => {
      let startLabel: LabelGeometry | null = null;
      let endLabel: LabelGeometry | null = null;

      //Find the startLabel and end Label
      let startVPos: VerticalPosition;
      let endVPos: VerticalPosition;

      if (arrow.type === VariationType.Constant) {
        startVPos = arrow.position || previousEndPosition || "center";
        endVPos = startVPos;
      } else if (arrow.type === VariationType.Increasing) {
        startVPos = "bottom";
        endVPos = "top";
        previousEndPosition = endVPos ;
      } else {
        //if (arrow.type === VariationType.Decreasing)
        startVPos = "top";
        endVPos = "bottom";
        previousEndPosition = endVPos ;
      }

      labelGeometry?.forEach((currentLabelData) => {
        const matchingRow = currentLabelData.row == arrow.row;
        if (!matchingRow) return;

        const matchingStartColumn =
          currentLabelData.column === arrow.startColumn &&
          currentLabelData.vpos === startVPos;
        if (matchingStartColumn) {
          if (currentLabelData.hpos !== "left") {
            startLabel = currentLabelData;
          }
        }
        const matchingEndColumn =
          currentLabelData.column == arrow.endColumn &&
          currentLabelData.vpos === endVPos;
        if (matchingEndColumn) {
          if (currentLabelData.hpos !== "right") {
            endLabel = currentLabelData;
          }
        }
      });

      const { x1, x2, y1, y2 } = ComputeArrowEnds(
        tableData,
        arrow,
        startVPos,
        endVPos,
        startLabel,
        endLabel
      );

      //set arrow head with markerEnd and markerStart
      let arrowHeadPosition: Record<string, string> = {};
      if (
        arrow.arrowHeadPosition === "end" ||
        arrow.arrowHeadPosition === "both"
      ) {
        arrowHeadPosition["markerEnd"] = `url(#${ArrowHeadId})`;
      }
      if (
        arrow.arrowHeadPosition === "start" ||
        arrow.arrowHeadPosition === "both"
      ) {
        arrowHeadPosition["markerStart"] = `url(#${ArrowHeadId})`;
      }

      return (
        <line
          key={`variationArrow${i}`}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
          strokeWidth={1}
          stroke="black"
          {...arrowHeadPosition}
        />
      );
    }
  );
  return arrows;
}

function ComputeArrowEnds(
  tableData: TableData,
  arrow: VariationArrow,
  startVPos : VerticalPosition,
  endVPos : VerticalPosition,
  startLabel: LabelGeometry | null,
  endLabel: LabelGeometry | null
): { x1: number; x2: number; y1: number; y2: number } {
  let labelsTopBottomMargin = tableData.LabelsTopBottomMargin;
  let labelWidth1 = startLabel ? startLabel.width : 0;
  let labelHeight1 = startLabel ? startLabel.height : 0;
  let labelWidth2 = endLabel ? endLabel.width : 0;
  let labelHeight2 = endLabel ? endLabel.height : 0;

  let cx1 = tableData.getNodeX(arrow.startColumn);
  let cx2 = tableData.getNodeX(arrow.endColumn);
  let cy1:number ;
  let cy2:number ;

  const yTop = tableData.getNodeY(arrow.row) + labelsTopBottomMargin;
  const yBottom = tableData.getNodeY(arrow.row + 1) - labelsTopBottomMargin;
  const yCenter = 0.5*(yTop+yBottom) ;

  if(startVPos==="top") cy1 = yTop ;
  else if(startVPos==="bottom") cy1 = yBottom;
  else cy1 = yCenter ;

  if(endVPos==="top") cy2 = yTop ;
  else if(endVPos==="bottom") cy2 = yBottom;
  else cy2 = yCenter ;


  if (startLabel) {
    if (startLabel.hpos === "right") {
      cx1 += labelWidth1 / 2;
    }
    if (startLabel.hpos === "center") {
      labelWidth1 = labelWidth1 / 2;
    }
    if (startLabel.vpos === "top") {
      cy1 += labelHeight1 / 2;
    }
    if (startLabel.vpos === "bottom") {
      cy1 -= labelHeight1 / 2;
    }
  }

  if (endLabel) {
    if (endLabel.hpos === "left") {
      cx2 -= labelWidth2 / 2;
    }
    if (endLabel.hpos === "center") {
      labelWidth2 = labelWidth2 / 2;
    }
    if (endLabel.vpos === "top") {
      cy2 += labelHeight2 / 2;
    }
    if (endLabel.vpos === "bottom") {
      cy2 -= labelHeight2 / 2;
    }
  }

  //Make sure the arrow is really horizontale in case it is a CONST arrow
  if(startVPos === endVPos){
    cy2 =cy1 ;
  }

  //shorten the arrow, while keeping alignement.
  let d = Math.abs((cy2 - cy1) / (cx2 - cx1));
  // d=0 if it is an horizontal arrow

  let sign = Math.sign(cy2 - cy1);
  const space = 5;
  let dx1 = Math.min(labelWidth1, labelHeight1 / (2 * d)||Infinity) + space;
  //the Infinity if to make sure it doesn't return NaN

  let dy1 = sign * dx1 * d;
  let dx2 = Math.min(labelWidth2, labelHeight2 / (2 * d)||Infinity) + space;
  let dy2 = sign * dx2 * d;

  return { x1: cx1 + dx1, x2: cx2 - dx2, y1: cy1 + dy1, y2: cy2 - dy2 };
}