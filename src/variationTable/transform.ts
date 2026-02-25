// @ts-ignore
import { parse } from './parser.js';

import {
  SeparatorType,
  VariationType,
  type ColumnSeparator,
  type ColumnSeparatorLabel,
  type HorizontalPosition,
  type RowData,
  type Sign,
  type TableDataArgs,
  type VariationArrow,
  type VerticalPosition,
} from './models/TableData.js';

export interface AstHeader {
  type: string;
  variable: string | null;
  domains: string[];
}
export interface AstRowContent {
  type: string;
  value: string | null;
  options: Record<string, string | number> | null;
}

export interface AstRow {
  type: string;
  label: string | null;
  heightMultiplier: number | null;
  contents: AstRowContent[];
}

export interface Ast {
  type: string;
  header: AstHeader;
  rows: AstRow[];
}

export interface ParseResult {
  ast?: Ast;
  error?: string;
}
export interface transformationResult {
  data?: TableDataArgs;
  error?: string;
}

export function parseToAst(input: string): ParseResult {
  let result: ParseResult = {};

  try {
    const output: Ast = parse(input);
    result.ast = output;
  } catch (error) {
    const err = error as { message?: string };
    result.error = err.message ?? 'Unknown parse error';
  }

  return result;
}

export function astToTableData({
  ast,
  error,
}: ParseResult): transformationResult {
  if (error || !ast) return { error };

  let tableDataArgs: TableDataArgs = {
    variable: ast.header.variable,
    rowLabels: [],
    columnHeaders: ast.header.domains,
    columnSeparators: [],
    variationArrows: [],
    signs: [],
  };
  ast.rows.forEach((e) => {
    let rowData: RowData = {
      content: e.label || '',
      heightMultiplier: e.heightMultiplier || 1,
    };
    tableDataArgs.rowLabels.push(rowData);
  });
  for (let i = 0, currentRow = 1; i < ast.rows.length; i++, currentRow++) {
    let row = ast.rows[i];

    let currentColumn = 0;
    let lastContentType: string | null = null;
    for (let c = 0; c < row.contents.length; c++) {
      let content = row.contents[c];
      if (
        // only skip increment in  the transition:
        //Separator → non-Separator
        lastContentType !== 'Separator' ||
        content.type === 'Separator'
      ) {
        currentColumn++;
      }
      lastContentType = content.type;

      if (content.type === 'Separator') {
        //create separator
        let sepType: SeparatorType;
        switch (content.value) {
          case 'double':
            sepType = SeparatorType.DoubleBar;
            break;
          case 'double-dashed':
            sepType = SeparatorType.DoubleDashed;
            break;
          case 'single':
            sepType = SeparatorType.SingleBar;
            break;
          case 'dashed':
            sepType = SeparatorType.Dashed;
            break;
          default: // 'none' or other
            sepType = SeparatorType.None;
            break;
        }
        let sep: ColumnSeparator = {
          type: sepType,
          column: currentColumn,
          row: currentRow,
        };
        let labels: ColumnSeparatorLabel[] = [];
        for (const key in content.options) {
          const value = content.options[key];
          if (typeof value === 'string') {
            let pos = splitPositionKey(key);
            if (pos) {
              labels.push({
                value: content.options[key] as string,
                vPosition: pos[0],
                hPosition: pos[1],
              });
            }
          }
        }
        sep.labels = labels;
        tableDataArgs.columnSeparators.push(sep);
      }
      if (content.type === 'Command') {
        if (
          content.value === 'INC' ||
          content.value === 'DEC' ||
          content.value === 'CONST'
        ) {
          //create variation arrow
          let varType: VariationType;
          switch (content.value) {
            case 'DEC':
              varType = VariationType.Decreasing;
              break;
            case 'CONST':
              varType = VariationType.Constant;
              break;
            case 'INC':
              varType = VariationType.Increasing;
              break;
          }
          if (content.value) {
          }
          let colSpan: number =
            getOptionAs(content.options, 'colSpan', 'number') || 1;
          let columnStart = currentColumn;
          let columnEnd = columnStart + colSpan;
          currentColumn += colSpan - 1;
          let varArrow: VariationArrow = {
            type: varType,
            arrowHeadPosition: 'start',
            startColumn: columnStart,
            endColumn: columnEnd,
            row: currentRow,
            topOffset: 0,
            bottomOffset: 0,
          };
          tableDataArgs.variationArrows.push(varArrow);
        }
      }
      if (content.type === 'Text') {
        let colSpan: number =
          getOptionAs(content.options, 'colSpan', 'number') || 1;
        let columnStart = currentColumn;
        let columnEnd = currentColumn + colSpan;
        currentColumn += colSpan - 1;

        //create Text/sign
        let text: Sign = {
          value: content.value || '',
          row: currentRow,
          columnStart: columnStart,
          columnEnd: columnEnd,
        };
        tableDataArgs.signs.push(text);
      }
    }
  }
  return { data: tableDataArgs };
}

function getOptionAs<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  type: 'number'
): number | null;

function getOptionAs<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  type: 'string'
): string | null;

function getOptionAs<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  type: 'number' | 'string'
): string | number | null {
  if (!obj || !(key in obj)) return null;

  const value = obj[key];
  if (type === 'number') {
    return Number(value);
  } else return value as string;
}

function splitPositionKey(
  key: string
): [VerticalPosition, HorizontalPosition] | null {
  const parts = key.split('-');
  if (parts.length !== 2) return null;

  const [v, h] = parts;

  const vPoss: VerticalPosition[] = ['top', 'center', 'bottom'];
  const hPoss: HorizontalPosition[] = ['left', 'center', 'right'];

  if (!vPoss.includes(v as VerticalPosition)) return null;
  if (!hPoss.includes(h as HorizontalPosition)) return null;

  return [v as VerticalPosition, h as HorizontalPosition];
}
