import { TkzTabRow } from "../../parser/types";
import { LayoutConfig } from "../layoutConfig";
import { Label, Point, Segment } from "../types";

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


export function getRectCenter({
  left,
  right,
  top,
  bottom,
}: {
  left: number;
  right: number;
  top: number;
  bottom: number;
}): Point {
  return { x: (left + right) / 2, y: (top + bottom) / 2 };
}
export function getLabelBounds(label: Label): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} | null {
  const w = label.measuredWidth ?? 0;
  const h = label.measuredHeight ?? 0;
  const { x, y } = label.anchor;

  const left =
    label.hPosition === "left"
      ? x - w
      : label.hPosition === "right"
      ? x
      : x - w / 2;
  const right = left + w;

  const top =
    label.vPosition === "top"
      ? y
      : label.vPosition === "bottom"
      ? y - h
      : y - h / 2;
  const bottom = top + h;

  return { left, right, top, bottom };
}

export function getSegmentIntersection(seg1: Segment, seg2: Segment): Point | null {

  const delta =
    (seg1.end.x - seg1.start.x) * (seg2.end.y - seg2.start.y) -
    (seg2.end.x - seg2.start.x) * (seg1.end.y - seg1.start.y);
  if (delta === 0) return null; //the two segments are parallels
  const gamma =
    (seg1.end.y - seg1.start.y) * (seg2.start.x - seg1.start.x) -
    (seg2.start.y - seg1.start.y) * (seg1.end.x - seg1.start.x);
  const k = gamma / delta;
  const x = k * (seg2.end.x - seg2.start.x) + seg2.start.x;
  const y = k * (seg2.end.y - seg2.start.y) + seg2.start.y;
  //make sure the intersetionPoint is on the both segment. 
  if (
    Math.abs(seg1.start.x + seg1.end.x -2* x) <= Math.abs(seg1.start.x-seg1.end.x) &&
    Math.abs(seg2.start.x + seg2.end.x -2* x) <= Math.abs(seg2.start.x-seg2.end.x)
  ) {
    return { x, y };
  }
  return null ;
}

export function getSegmentRectIntersection(seg:Segment, rect:{left:number,right:number,top:number,bottom:number}):Point|null{
  let intersection:Point|null = null ;

  intersection = getSegmentIntersection(seg,{
    start: {x : rect.right, y : rect.top},
    end: {x : rect.left, y : rect.top},
  })
  if(intersection) return intersection ;

  intersection = getSegmentIntersection(seg,{
    start: {x : rect.right, y : rect.bottom},
    end: {x : rect.right, y : rect.top},
  })
  if(intersection) return intersection ;

  intersection = getSegmentIntersection(seg,{
    start: {x : rect.left, y : rect.bottom},
    end: {x : rect.right, y : rect.bottom},
  })
  if(intersection) return intersection ;


  intersection = getSegmentIntersection(seg,{
    start: {x : rect.left, y : rect.top},
    end: {x : rect.left, y : rect.bottom},
  })

  return intersection ;
}


export function shortenSegment(seg : Segment, shift:number ):Segment{
  if(seg.end.y - seg.start.y !== 0){
    const slope = (seg.end.x - seg.start.x)/(seg.end.y - seg.start.y) ;
    const startX = seg.start.x + shift*slope;
    const startY = seg.start.y + shift ;

    const endX = seg.end.x - shift*slope
    const endY = seg.end.y - shift ;
    
    return {
      start : {
        x: startX,
        y: startY
      },
      end : {
        x: endX,
        y: endY
      }
    }
  }
}