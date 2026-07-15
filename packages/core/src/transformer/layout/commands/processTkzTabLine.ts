import { TkzTabLine } from "../../../parser/types";
import { LayoutConfig } from "../../layoutConfig";
import {
  LayoutColumnSeparator,
  LineContentLabel,
  LayoutForbiddenRegion,
  SeparatorType,
  ColumnSeparatorLabel,
} from "../../types";
import { getInterNodeY, getNodeX, getInterNodeX } from "../geometry";

export interface ProcessTkzTabLineResult {
  lineContents: LineContentLabel[];
  columnSeparatorLabels: ColumnSeparatorLabel[];
  columnSeparators: LayoutColumnSeparator[];
  forbiddenRegions: LayoutForbiddenRegion[];
}

export function processTkzTabLine(
  line: TkzTabLine,
  row: number,
  rowBoundaries: number[],
  config: LayoutConfig
): ProcessTkzTabLineResult {
  const columnSeparators: LayoutColumnSeparator[] = [];
  const columnSeparatorLabels: ColumnSeparatorLabel[] = [];
  const lineContents: LineContentLabel[] = [];
  const forbiddenRegions: LayoutForbiddenRegion[] = [];

  const rowCenterY = getInterNodeY(row, row + 1, rowBoundaries);

  line.elements.forEach((el, i) => {
    const col = Math.floor(i / 2) + 1; // 1-based node index, same convention as geometry helpers
    if (el.kind === "empty") return;
//-----------------
      if (i % 2 === 0 //separator position
          && el.kind === "keyword" && 
          (el.value === 'd' || el.value === 't' || el.value === 'z')
        ){

      }
      else if(i % 2)


//------------------------
    if (i % 2 === 0) {
      // --- column separator slot ---
      const x = getNodeX(col, config); // fixMe look at the signature of getNodeX
      const anchor = { x, y: rowCenterY };
      const position = {
        start: { x, y: rowBoundaries[row] },
        end: { x, y: rowBoundaries[row + 1] },
      };

      if (el.kind === "keyword") {
        let type: SeparatorType;

        switch (el.value) {
          case "z":
            type = SeparatorType.Dashed;
            columnSeparatorLabels.push({
              role: "columnSeparatorLabel",
              row,
              columnSeparatorIndex: col - 1,
              value: "$0$",
              anchor,
              vPosition: "center",
              hPosition: "center",
            });
            break;
          case "t":
            type = SeparatorType.Dashed;
            break;
          case "d":
            type = SeparatorType.DoubleBar;
            break;
          default: // el.value = + , - or h
            type = SeparatorType.None ;
            columnSeparatorLabels.push({
              role: "columnSeparatorLabel",
              row,
              columnSeparatorIndex: col - 1,
              value: el.value,
              anchor,
              vPosition: "center",
              hPosition: "center",
            });
        }

        columnSeparators.push({
          type,
          columnSeparatorIndex: col - 1,
          row,
          position,
        });
      } else if (el.kind === "content") {
        columnSeparators.push({
          type: SeparatorType.None,
          columnSeparatorIndex: col - 1,
          row,
          position,
        });

        columnSeparatorLabels.push({
          role: "columnSeparatorLabel",
          row,
          columnSeparatorIndex: col - 1,
          value : el.value.value,
          anchor,
          vPosition: "center",
          hPosition: "center",
        });
      }
    } else {
      // --- content slot ---
      const columnSeparatorStart = col - 1;
      const columnSeparatorEnd = col;
      const centerX = getInterNodeX(col, col + 1, config);
      const anchor = { x: centerX, y: rowCenterY };

      if (el.kind === "keyword" && el.value === "h") {
        forbiddenRegions.push({
          row,
          columnSeparatorStart,
          columnSeparatorEnd,
          bounds: {
            x: getNodeX(col, config),
            y: rowBoundaries[row],
            width: getNodeX(col + 1, config) - getNodeX(col, config),
            height: rowBoundaries[row + 1] - rowBoundaries[row],
          },
        });
      } else {
        const value = el.kind === "keyword" ? el.value : el.value.value;
        lineContents.push({
          role: "lineContent",
          row,
          columnSeparatorStart,
          columnSeparatorEnd,
          value: `$${value}$`,
          anchor,
          vPosition: "center",
          hPosition: "center",
        });
      }
    }
  });

  return { columnSeparators, columnSeparatorLabels, lineContents, forbiddenRegions };
}