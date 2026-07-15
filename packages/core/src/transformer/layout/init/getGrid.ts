import { LayoutConfig } from "../../layoutConfig";
import { Segment } from "../../types";

export function getGrid(width:number, rowBoundaries:number[], config: LayoutConfig): Segment[] {
  const height = rowBoundaries[rowBoundaries.length - 1];

  const grid: Segment[] = [];

  // Outline: top, bottom, left, right
  grid.push({ start: { x: 0, y: 0 }, end: { x: width, y: 0 } });
  grid.push({ start: { x: 0, y: height }, end: { x: width, y: height } });
  grid.push({ start: { x: 0, y: 0 }, end: { x: 0, y: height } });
  grid.push({ start: { x: width, y: 0 }, end: { x: width, y: height } });

  // Row separators: one horizontal line at each internal row boundary
  // (excludes the very top and the very bottom, already part of the outline)
  for (let i = 1; i < rowBoundaries.length - 1; i++) {
    const y = rowBoundaries[i];
    grid.push({ start: { x: 0, y }, end: { x: width, y } });
  }

  // First column border: separates the row-label column from the table body
  grid.push({
    start: { x: config.labelColumnWidth, y: 0 },
    end: { x: config.labelColumnWidth, y: height },
  });

  return grid;
}