import { TkzTabRow } from "../../parser/types";
import { LayoutConfig } from "../layoutConfig";

/**
 * Returns the y position of each row boundary, from the top of the header
 * row (0) down to the bottom of the last row.
 * Result length is always `rows.length + 1`.
 */

export function getRowBoundaries(rows: TkzTabRow[], config: LayoutConfig): number[] {
  const boundaries: number[] = [0];
  let previousBoundary = 0 ;

  rows.forEach((row, i) => {
    const baseHeight = i === 0 ? config.headerRowHeight : config.baseRowHeight;
    const currentBoundary  = previousBoundary  + row.height * baseHeight ;
    boundaries.push(currentBoundary );
    previousBoundary  = currentBoundary  ;
  });

  return boundaries;
}

export function getTableWidth(antecedentCount : number, config: LayoutConfig): number {
  return (
    config.labelColumnWidth +
    2 * config.headerLeftRightMargin +
    (antecedentCount  - 1) * config.standardColumnWidth
  );
}

/**
 * X position of a column separator
 */
export function getNodeX(separatorIndex: number, config: LayoutConfig): number {
  return (
    config.labelColumnWidth +
    config.headerLeftRightMargin +
    separatorIndex * config.standardColumnWidth
  );
}

/**
 * X position interpolated between two columnSeparator.
 * `position` is between 0 and 1 (0 = at separatorIndex1, 1 = at separatorIndex2), default 0.5 (center).
 */
export function getInterNodeX(
  separatorIndex1: number,
  separatorIndex2: number,
  config: LayoutConfig,
  position = 0.5
): number {
  const x1 = getNodeX(separatorIndex1, config);
  const x2 = getNodeX(separatorIndex2, config);
  return x1 + (x2-x1)*position ;
}

/**
 * Y position interpolated between two row boundaries.
 * `position` is between 0 and 1 (0 = at row1, 1 = at row2), default 0.5 (center).
 */
export function getInterNodeY(row1: number, row2: number, rowBoundaries: number[], position = 0.5): number {
  const y1 = rowBoundaries[row1];
  const y2 = rowBoundaries[row2];
  return y1 + (y2 - y1) * position;
}