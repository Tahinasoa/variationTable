import { LayoutConfig } from "../../layoutConfig";
import { Segment } from "../../types";

export function getGrid(width:number, rowBoundaries:number[], config: LayoutConfig): Segment[] {
  const height = rowBoundaries[rowBoundaries.length - 1];

  const grid: Segment[] = [];
  const m = config.strokeWidth/2 ; //make sure the lines are drawn inside the svgElement
  // Outline: top, bottom, left, right
  grid.push({ start: { x: m, y: m }, end: { x: width-m, y: m } });
  grid.push({ start: { x: m, y: height-m }, end: { x: width-m, y: height-m } });
  grid.push({ start: { x: m, y: m }, end: { x: m, y: height-m } });
  grid.push({ start: { x: width-m, y: m }, end: { x: width-m, y: height-m } });

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