import { TkzTabVar } from "../../../parser/types";
import { LayoutConfig } from "../../layoutConfig";
import {
  ColumnSeparatorLabel,
  LayoutColumnSeparator,
  LayoutForbiddenRegion,
  LayoutVariationArrow,
  SeparatorType,
  VariationType,
  VerticalPosition,
  HorizontalPosition,
} from "../../types";
import { getNodeX } from "../geometry";

export interface ProcessTkzTabVarResult {
  columnSeparators: LayoutColumnSeparator[];
  columnSeparatorLabels: ColumnSeparatorLabel[];
  variationArrows: LayoutVariationArrow[];
  forbiddenRegions: LayoutForbiddenRegion[];
}

type Sign = { columnSeparatorIndex: number; left: "+" | "-"; right?: "+" | "-" };

const simpleModifiers = [
  "+", "-", "+C", "-C", "+D", "-D", "D+", "D-",
  "+DH", "-DH", "+CH", "-CH", "+H", "-H", "R",
];
const doubleModifiers = [
  "+D-", "-D+", "+D+", "-D-", "+CD+", "-CD-", "+CD-", "-CD+",
  "+DC+", "-DC-", "+DC-", "-DC+", "+V+", "-V-", "+V-", "-V+",
];

export function processTkzTabVar(
  varCmd: TkzTabVar,
  row: number,
  rowBoundaries: number[],
  config: LayoutConfig
): ProcessTkzTabVarResult {
  const columnSeparators: LayoutColumnSeparator[] = [];
  const columnSeparatorLabels: ColumnSeparatorLabel[] = [];
  const variationArrows: LayoutVariationArrow[] = [];
  const forbiddenRegions: LayoutForbiddenRegion[] = [];

  const rowTop = rowBoundaries[row] ;
  const rowBottom = rowBoundaries[row + 1];


function labelAnchor(columnSeparatorIndex: number, vPosition: VerticalPosition,hPosition:HorizontalPosition) {
    const nodeX = getNodeX(columnSeparatorIndex, config)

    const x =
      hPosition === "left"
        ? nodeX - config.labelsLeftRightMargin 
        : 
        hPosition === "right"
        ? nodeX + config.labelsLeftRightMargin
        : nodeX ;
    const y =
      vPosition === "top"
        ? rowTop + config.labelsTopBottomMargin 
        : rowBottom - config.labelsTopBottomMargin ;
    return { x, y };
  }

  function makeLabel(
    columnSeparatorIndex: number,
    value: string | undefined,
    vPosition: VerticalPosition,
    hPosition: HorizontalPosition
  ): ColumnSeparatorLabel[] {
    if (!value) return [];
    return [
      {
        role: "columnSeparatorLabel",
        row,
        columnSeparatorIndex,
        value,
        anchor: labelAnchor(columnSeparatorIndex, vPosition,hPosition),
        vPosition,
        hPosition,
      },
    ];
  }

  let currSign: Sign | null = null;
  let lastSign: Sign | null = null;
  let isForbiddenRegion = false;
  varCmd.elements.forEach((curr, i) => {
    const columnSeparatorIndex = i; // TkzTabVar elements map 1:1 to separator nodes, no interleaving

    if (
      !simpleModifiers.includes(curr.modifier) &&
      !doubleModifiers.includes(curr.modifier) &&
      curr.modifier !== "R"
    ) {
      throw new Error(
        `Unsupported modifier ${curr.modifier} for variation element at row ${row}, index ${i}`
      );
    }

    const modifier = curr.modifier;

    if (simpleModifiers.includes(modifier)) {
      currSign = modifier.includes("+")
        ? { columnSeparatorIndex, left: "+" }
        : modifier.includes("-")
        ? { columnSeparatorIndex, left: "-" }
        : null;
    } else if (doubleModifiers.includes(modifier)) {
      currSign = {
        columnSeparatorIndex,
        left: modifier[0] as "+" | "-",
        right: modifier[modifier.length - 1] as "+" | "-",
      };
    }

    const signCount = modifier.split("").filter((c) => c === "+" || c === "-").length;
    if ((signCount === 0 || signCount > 2) && modifier !== "R") {
      throw new Error(
        `Unsupported modifier ${curr.modifier} for variation element at row ${row}, index ${i}`
      );
    }

    const pushSeparator = (type: SeparatorType, labels: ColumnSeparatorLabel[]) => {
      columnSeparators.push({ type, columnSeparatorIndex, row, position: {
        start: { x: getNodeX(columnSeparatorIndex, config), y: rowTop },
        end: { x: getNodeX(columnSeparatorIndex, config), y: rowBottom },
      }});
      columnSeparatorLabels.push(...labels);
    };

    const pushForbiddenRegion = () => {
      const x1 = getNodeX(columnSeparatorIndex, config);
      const x2 = getNodeX(columnSeparatorIndex + 1, config);
      forbiddenRegions.push({
        row,
        columnSeparatorStart: columnSeparatorIndex,
        columnSeparatorEnd: columnSeparatorIndex + 1,
        bounds: { x: x1, y: rowTop, width: x2 - x1, height: rowBottom - rowTop },
      });
    };

    if (modifier === "R") {
      // skip: no separator, no label, no forbidden region
    } else if (modifier === "+" || modifier === "-") {
      pushSeparator(
        SeparatorType.None,
        makeLabel(columnSeparatorIndex, curr.left?.value, modifier === "+" ? "top" : "bottom", "center")
      );
    } else if (modifier === "+C" || modifier === "-C") {
      pushSeparator(
        SeparatorType.DoubleBar,
        makeLabel(columnSeparatorIndex, curr.left?.value, modifier === "+C" ? "top" : "bottom", "center")
      );
    } else if (modifier === "+D" || modifier === "-D") {
      pushSeparator(
        SeparatorType.DoubleBar,
        makeLabel(columnSeparatorIndex, curr.left?.value, modifier === "+D" ? "top" : "bottom", "left")
      );
    } else if (modifier === "D+" || modifier === "D-") {
      const label = curr.left?.value || curr.right?.value;
      pushSeparator(
        SeparatorType.DoubleBar,
        makeLabel(columnSeparatorIndex, label, modifier === "D+" ? "top" : "bottom", "right")
      );
    } else if (modifier === "+CH" || modifier === "-CH") {
      pushForbiddenRegion();
      pushSeparator(
        SeparatorType.DoubleBar,
        makeLabel(columnSeparatorIndex, curr.left?.value, modifier === "+CH" ? "top" : "bottom", "center")
      );
    } else if (modifier === "+DH" || modifier === "-DH") {
      pushForbiddenRegion();
      pushSeparator(
        SeparatorType.DoubleBar,
        makeLabel(columnSeparatorIndex, curr.left?.value, modifier === "+DH" ? "top" : "bottom", "left")
      );
    } else if (modifier === "+H" || modifier === "-H") {
      pushForbiddenRegion();
      pushSeparator(
        SeparatorType.None,
        makeLabel(columnSeparatorIndex, curr.left?.value, modifier === "+H" ? "top" : "bottom", "center")
      );
    } else if (/^[+-](D|CD|DC|V)[+-]$/.test(modifier)) {
      const type = modifier.slice(1, -1);
      const separatorType = type === "V" ? SeparatorType.None : SeparatorType.DoubleBar;

      const firstVPosition: VerticalPosition = currSign?.left === "+" ? "top" : "bottom";
      const secondVPosition: VerticalPosition = currSign?.right === "+" ? "top" : "bottom";
      const firstHPosition: HorizontalPosition = type === "CD" ? "center" : "left";
      const secondHPosition: HorizontalPosition = type === "DC" ? "center" : "right";

      const labels = [
        ...makeLabel(columnSeparatorIndex, curr.left?.value ?? "", firstVPosition, firstHPosition),
        ...makeLabel(columnSeparatorIndex, curr.right?.value ?? "", secondVPosition, secondHPosition),
      ];
      pushSeparator(separatorType, labels);
    } else {
      throw new Error(
        `Unsupported modifier ${curr.modifier} for variation element at row ${row}, index ${i}`
      );
    }

    // --- variation arrows ---
    if (!isForbiddenRegion && currSign !== null && lastSign !== null) {
      const startX = getNodeX(lastSign.columnSeparatorIndex, config);
      const endX = getNodeX(currSign.columnSeparatorIndex, config);
      const yTop = rowTop+config.labelsTopBottomMargin ;
      const yBottom = rowBottom - config.labelsTopBottomMargin ;

      if (currSign.left === "+" && lastSign.right === "-") {
        variationArrows.push({
          type: VariationType.Increasing,
          arrowHeadPosition: "end",
          columnSeparatorStart: lastSign.columnSeparatorIndex,
          columnSeparatorEnd: currSign.columnSeparatorIndex,
          row,
          originalPath : { start: { x: startX, y: yBottom }, end: { x: endX, y: yTop } },
        });
      } else if (currSign.left === "-" && lastSign.right === "+") {
        variationArrows.push({
          type: VariationType.Decreasing,
          arrowHeadPosition: "end",
          columnSeparatorStart: lastSign.columnSeparatorIndex,
          columnSeparatorEnd: currSign.columnSeparatorIndex,
          row,
          originalPath: { start: { x: startX, y: yTop }, end: { x: endX, y: yBottom } },
        });
      } else if (currSign.left === "+" && lastSign.right === "+") {
        variationArrows.push({
          type: VariationType.Constant,
          vPosition: "top",
          arrowHeadPosition: "end",
          columnSeparatorStart: lastSign.columnSeparatorIndex,
          columnSeparatorEnd: currSign.columnSeparatorIndex,
          row,
          originalPath: { start: { x: startX, y: yTop }, end: { x: endX, y: yTop } },
        });
      } else if (currSign.left === "-" && lastSign.right === "-") {
        variationArrows.push({
          type: VariationType.Constant,
          vPosition: "bottom",
          arrowHeadPosition: "end",
          columnSeparatorStart: lastSign.columnSeparatorIndex,
          columnSeparatorEnd: currSign.columnSeparatorIndex,
          row,
          originalPath: { start: { x: startX, y: yBottom }, end: { x: endX, y: yBottom } },
        });
      }
    }

    isForbiddenRegion = modifier.includes("H");
    if (currSign) {
      lastSign = { ...currSign };
      if (!currSign.right) {
        lastSign.right = currSign.left;
      }
    }
  });

  return { columnSeparators, columnSeparatorLabels, variationArrows, forbiddenRegions };
}