import { LayoutConfig } from "./layoutConfig";


// ---------------------------------------------------------------------------
// Geometry primitives
// ---------------------------------------------------------------------------



export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Segment {
  start: Point;
  end: Point;
}

// ---------------------------------------------------------------------------
// Shared enums / unions
// ---------------------------------------------------------------------------

export enum SeparatorType {
  None = 'none',
  SingleBar = 'singleBar',
  DoubleBar = 'doubleBar',
  Dashed = 'dashed',
  DoubleDashed = 'doubleDashed',
}

export enum VariationType {
  Increasing = 'increasing',
  Decreasing = 'decreasing',
  Constant = 'constant',
}

export type VerticalPosition = 'top' | 'center' | 'bottom';
export type HorizontalPosition = 'left' | 'center' | 'right';
export type ArrowHeadPosition = 'start' | 'end' | 'both' | 'none';

// ---------------------------------------------------------------------------
// Layout entities
// ---------------------------------------------------------------------------

// ------------- Labels -------------------
export type LabelRole =
  | 'columnSeparatorLabel'
  | 'intermediateImage'
  | 'intermediateAntecedent'
  | 'rowLabel'
  | 'lineContent'
  | 'columnHeader';

export interface BaseLabel {
  role :  LabelRole;
  value : string;
  anchor : Point;
  vPosition : VerticalPosition;
  hPosition : HorizontalPosition;
  //filled in by the geometric correction pass, after DOM measurement
  measuredWidth?: number;
  measuredHeight?: number;
}

export interface RowLabel extends BaseLabel {
  role: 'rowLabel';
  row: number; // start at 0 on the first row = the header row
}

export interface ColumnHeaderLabel extends BaseLabel {
  role: 'columnHeader';
  columnSeparatorIndex: number; //given that header labels are aligned with separator not between them.
}
export interface LineContentLabel extends BaseLabel {
  role: 'lineContent';
  row: number;// start at 0 on the first row = the header row
  columnSeparatorStart: number; //columnSeparator is 0 at the first one after variable column.
  columnSeparatorEnd: number;
}


export interface ColumnSeparatorLabel extends BaseLabel {
  role: 'columnSeparatorLabel';
  row: number;
  columnSeparatorIndex : number;
}

export interface IntermediateImageLabel extends BaseLabel {
  role: 'intermediateImage';
  row: number;
  columnSeparatorStart: number;//columnSeparator is 0 at the first one after variable column.
  columnSeparatorEnd: number;
  position: number; //a value between 0 and 1, indicating the relative position of the image between the two columns
}

export interface IntermediateAntecedentLabel extends BaseLabel {
  role: 'intermediateAntecedent';
  row: number;
  columnSeparatorStart: number;//columnSeparator is 0 at the first one after variable column.
  columnSeparatorEnd: number;
  position: number; //a value between 0 and 1, indicating the relative position of the antecedent between the two columns
}

export type Label =
  | ColumnSeparatorLabel
  | IntermediateImageLabel
  | IntermediateAntecedentLabel
  | RowLabel
  | LineContentLabel
  | ColumnHeaderLabel;

// ------------ Geometric entities -----------------
export interface LayoutColumnSeparator {
  type: SeparatorType;
  columnSeparatorIndex: number;
  row: number;
  position: Segment;
}

export interface LayoutVariationArrow {
  type: VariationType;
  vPosition?: VerticalPosition; // only used when type is Constant
  arrowHeadPosition: ArrowHeadPosition;
  columnSeparatorStart: number;
  columnSeparatorEnd: number;
  row: number;
  originalPath: Segment; //path is th
  // Corrected by the geometric correction pass, after DOM measurement
  correctedPath ? :Segment;
}

export interface LayoutForbiddenRegion {
  row: number;
  columnSeparatorStart: number;
  columnSeparatorEnd: number;
  bounds: Rect;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface LayoutData {
  config: LayoutConfig;

  width: number;
  height: number;

  // ---- Labels ---- //
  rowLabels: RowLabel[]; //include the labels of each row and the variableRow
  columnHeaders: ColumnHeaderLabel[];
  lineContents: LineContentLabel[];
  columnSeparatorLabels: ColumnSeparatorLabel[]; //Labels for variation arrows and TkzSlope.
  intermediateImages: IntermediateImageLabel[];
  intermediateAntecedents: IntermediateAntecedentLabel[];

  // --- Geometric entities --- //
  columnSeparators: LayoutColumnSeparator[]; //This contains a Label and a line:)
  variationArrows: LayoutVariationArrow[];
  forbiddenRegions: LayoutForbiddenRegion[];
  grid: Segment[]; //hold the structure of the table : outline,row separators first column border

}