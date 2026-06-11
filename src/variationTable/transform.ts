// @ts-ignore
import { parse } from './parser.mjs';

import {
  SeparatorType,
  VariationType,
  type ColumnSeparator,
  type RowData,
  type Sign,
  type TableDataArgs,
  type VariationArrow,
  type ForbidenRegion,
} from './models/TableData.js';

import type {
  TkzTabDocument,
  TkzTabInit,
  TkzTabLine,
  TkzTabVar,
  LineElementContent,
  VarElement,
} from './types';

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

export function parseToTableData(input: string): { data?: TableDataArgs; error?: string } {
  let ast: TkzTabDocument;
  try {
    ast = parse(input);
  } catch (e: any) {
    return { error: e.message ?? 'Unknown parse error' };
  }
  try {
    return { data: transform(ast) };
  } catch (e: any) {
    return { error: e.message ?? 'Unknown transform error' };
  }
}

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

function transform(ast: TkzTabDocument): TableDataArgs {
  if (ast.body[0].type !== "tkzTabInit") {
    throw new Error("tkztabInit not found");
  }

  const init = ast.body[0];

  const variable = init.rows[0]?.label.value ?? null;
  const rowLabels: RowData[] = init.rows.slice(1).map(r => ({
    content: r.label.value,
    heightMultiplier: r.height,
  }));

  const columnHeaders = init.antecedents.map(a => a.value);

  const columnSeparators: ColumnSeparator[] = [];
  const variationArrows: VariationArrow[] = [];
  const signs: Sign[] = [];
  const forbidenRegions: ForbidenRegion[] = [];

  // Parcours dans l'ordre du document
  let lineRow = 0;
  let varRow = 0;

  ast.body.forEach(cmd => {
    if (cmd.type === 'tkzTabLine') {
      lineRow++;
      processLine(cmd as TkzTabLine, lineRow, columnSeparators, signs, forbidenRegions);
    } else if (cmd.type === 'tkzTabVar') {
      varRow++;
      processVar(cmd, varRow, variationArrows, columnSeparators);
    }
  });

  return { variable, rowLabels, columnHeaders, columnSeparators, variationArrows, signs, forbidenRegions };
}

// ---------------------------------------------------------------------------
// Process \tkzTabLine
// ---------------------------------------------------------------------------

function processLine(
  line: TkzTabLine,
  row: number,
  columnSeparators: ColumnSeparator[],
  signs: Sign[],
  forbidenRegions: ForbidenRegion[],
) {
  line.elements.forEach((el, i) => {
    const col = Math.floor(i / 2) + 1;
    if (el.kind === 'empty') return;

    if (i % 2 === 0) {
      if (el.kind === 'keyword' && el.value !== 'h') {
        switch (el.value) {
          case 'z':
            columnSeparators.push({
              type: SeparatorType.Dashed,
              column: col,
              row,
              labels: [{ value: '$0$', vPosition: 'center', hPosition: 'center' }],
            });
            break;
          case 't':
            columnSeparators.push({ type: SeparatorType.Dashed, column: col, row });
            break;
          case 'd':
            columnSeparators.push({ type: SeparatorType.DoubleBar, column: col, row });
            break;
        }
      }
      else if (el.kind === "content" || (el.kind === "keyword" && el.value === "h")) {
        const value = el.kind === "content" ? `$${el.value.value}$` : 'h';
        columnSeparators.push({ type: SeparatorType.None, column: col, row, labels: [{ value: value, vPosition: 'center', hPosition: 'center' }] });
      }
    } else {
      if (el.kind === 'keyword' && el.value === 'h') {
        forbidenRegions.push({ row, columnStart: col, columnEnd: col + 1 });

      }
      else {

        const value =
          el.kind === 'keyword'
            ? el.value
            : el.value.value;
        signs.push({ value: `$${value}$`, row, columnStart: col, columnEnd: col + 1 });
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Process \tkzTabVar
// ---------------------------------------------------------------------------

function processVar(
  varCmd: TkzTabVar,
  row: number,
  variationArrows: VariationArrow[],
  columnSeparators: ColumnSeparator[],
) {
  const elements = varCmd.elements;

  for (let i = 0; i < elements.length - 1; i++) {
    const curr = elements[i];


    if (curr.kind === 'skip') continue;

    // Trouver le prochain élément non-skip et son index réel
    let nextIndex = i + 1;
    while (nextIndex < elements.length && elements[nextIndex].kind === 'skip') {
      nextIndex++;
    }
    if (nextIndex >= elements.length) continue;
    const next = elements[nextIndex];

    const startCol = i + 1;
    const endCol = nextIndex + 1;

    const currSign = curr.modifier[0];
    const nextSign = next.modifier[0];

    let varType: VariationType;
    let verticalPosition: 'top' | 'center' | 'bottom' | null = null;
    if (currSign === '-' && nextSign === '+') {
      varType = VariationType.Increasing;
    } else if (currSign === '+' && nextSign === '-') {
      varType = VariationType.Decreasing;
    } else if (currSign === nextSign && currSign === '+') {
      varType = VariationType.Constant;
      verticalPosition = 'top';
    } else {
      varType = VariationType.Constant;
      verticalPosition = 'bottom';
    }

    variationArrows.push({
      type: varType,
      arrowHeadPosition: 'end',
      startColumn: startCol,
      endColumn: endCol,
      position: verticalPosition ?? 'center',
      row: row + 1, //TODO: revoir le row, pourquoi le ++
    });
    columnSeparators.push(
      {
        type: SeparatorType.None,
        column: endCol,
        row: row + 1, //TODO: revoir le row, pourquoi le ++
        labels: [{ value: '', vPosition: verticalPosition ?? 'center', hPosition: 'center' }] //TODO: modifier le parseur pour récupérer la valeur du label associé à la variation
      });
  }
}

// //