export interface Node {
  x: number;
  y: number;
}

export interface RowData {
  content: string;
  heightMultiplier: number;
}

export enum SeparatorType {
  None = 'none',
  SingleBar = 'singleBar',
  DoubleBar = 'doubleBar',
  Dashed = 'dashed',
  DoubleDashed = 'doubleDashed',
}

export type VerticalPosition = 'top' | 'center' | 'bottom';
export type HorizontalPosition = 'left' | 'center' | 'right';

export interface ColumnSeparatorLabel {
  value: string;
  vPosition: VerticalPosition;
  hPosition: HorizontalPosition;
}

export interface ColumnSeparator {
  type: SeparatorType;
  column: number; // Which column boundary (after column X)
  row: number; // Which row this separator belongs to
  labels?: ColumnSeparatorLabel[];
}

export enum VariationType {
  Increasing = 'increasing', // Arrow goes up
  Decreasing = 'decreasing', // Arrow goes down
  Constant = 'constant', // Horizontal arrow
}

export interface VariationArrowGeometry {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export interface VariationArrow {
  type: VariationType;
  position?: VerticalPosition; //is considered only if VariationType is constant
  arrowHeadPosition: 'start' | 'end' | 'both' | 'none';
  startColumn: number;
  endColumn: number;
  row: number;
  topOffset: number;
  bottomOffset: number ;


}

export interface Sign {
  value: string;
  row: number;
  columnStart: number;
  columnEnd: number;
}
export interface TableDataArgs {
  variable: string | null;
  rowLabels: RowData[];
  columnHeaders: string[];
  columnSeparators: ColumnSeparator[];
  variationArrows: VariationArrow[];
  signs: Sign[];
}
export class TableData {
  // Data
  variable: string | null; //The name of the variable
  rowLabels: RowData[];
  columnHeaders: string[];
  columnSeparators: ColumnSeparator[];
  variationArrows: VariationArrow[];
  signs: Sign[];

  readonly columnCount: number;
  readonly rowCount: number;
  readonly width: number;
  readonly height: number;

  // Layout constant
  readonly labelColumnWidth = 120; //width of the firstColumn
  readonly headerRowHeight = 50;
  readonly standardColumnWidth = 120;
  readonly baseRowHeight = 110;
  readonly headerLeftRightMargin = 10;
  readonly LabelsTopBottomMargin = 10;

  constructor({
    variable,
    rowLabels,
    columnHeaders,
    columnSeparators,
    variationArrows,
    signs,
  }: TableDataArgs) {
    this.variable = variable;
    this.rowLabels = rowLabels;
    this.columnHeaders = columnHeaders;
    this.columnSeparators = columnSeparators;
    this.variationArrows = variationArrows;
    this.signs = signs;
    this.rowCount = this.rowLabels.length;
    this.columnCount = this.columnHeaders.length;
    this.width =
      this.labelColumnWidth +
      2 * this.headerLeftRightMargin +
      (this.columnCount - 1) * this.standardColumnWidth;
    this.height = this.headerRowHeight + this.getTotalRowsHeight();
  }

  private getTotalRowsHeight(): number {
    return this.rowLabels.reduce(
      (total, row) => total + this.baseRowHeight * row.heightMultiplier,
      0
    );
  }

  // get the coordinade of a Node
  getNode(row: number, col: number): Node {
    return {
      x: this.getNodeX(col),
      y: this.getNodeY(row),
    };
  }

  // X position of a node
  getNodeX(col: number): number {
    if (col === 0) return 0;
    return (
      this.labelColumnWidth +
      this.headerLeftRightMargin +
      (col - 1) * this.standardColumnWidth
    );
  }

  //Y position of a node
  getNodeY(row: number): number {
    // TODO SAFETY RULES HERE
    if (row === 0) return 0;
    if (row === 1) return this.headerRowHeight;

    let y = this.headerRowHeight;
    for (let i = 0; i < row - 1; i++) {
      y += this.baseRowHeight * this.rowLabels[i].heightMultiplier;
    }
    return y;
  }

  // Get the center point between two nodes
  getInterNode(row1: number, col1: number, row2: number, col2: number): Node {
    return {
      x: this.getInterNodeX(col1, col2),
      y: this.getInterNodeY(row1, row2),
    };
  }
  // X position of center between two columns
  getInterNodeX(col1: number, col2: number, position?: number): number {
    /*Position is a number between 0 and 1 and tell how close to col1 id the returned value; the default is 0.5 => at the center*/
    const pos = 1 - (position === undefined ? 0.5 : position);
    if (col1 === 0 && col2 === 1)
      //this condition ensure that the margin is not included in the calculation for the center of the fisrt column
      return this.labelColumnWidth * pos;
    const x1 = this.getNodeX(col1);
    const x2 = this.getNodeX(col2);
    return x1 * pos + x2 * (1 - pos);
  }
  getInterNodeY(row1: number, row2: number, position?: number): number {
    /*Position is a number between 0 and 1 and tell how close to row1 id the returned value; the default is 0.5 => at the center*/
    const y1 = this.getNodeY(row1);
    const y2 = this.getNodeY(row2);
    const pos = 1 - (position === undefined ? 0.5 : position);
    return y1 * pos + y2 * (1 - pos);
  }
}
