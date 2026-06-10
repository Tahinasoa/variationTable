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
  if(ast.body[0].type !== "tkzTabInit"){
    throw new Error("tkztabInit not found") ;
  }

  const init = ast.body[0] ;

  const variable     = init.rows[0]?.label.value ?? null;
  const rowLabels: RowData[] = init.rows.slice(1).map(r => ({
    content: r.label.value,
    heightMultiplier: r.height,
  }));

  const columnHeaders = init.antecedents.map(a => a.value);

  const columnSeparators: ColumnSeparator[] = [];
  const variationArrows: VariationArrow[]   = [];
  const signs: Sign[]                       = [];
  const forbidenRegions: ForbidenRegion[]   = [];

  // Parcours dans l'ordre du document
  let lineRow = 0;
  let varRow  = 0;

  ast.body.forEach(cmd => {
    if (cmd.type === 'tkzTabLine') {
      lineRow++;
      processLine(cmd as TkzTabLine, lineRow, columnSeparators, signs, forbidenRegions);
    } else if (cmd.type === 'tkzTabVar') {
      varRow++;
      processVar(cmd as TkzTabVar, varRow, variationArrows);
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
      if (el.kind !== 'keyword') return; //fix this logic
      switch (el.value) {
        case 'z':
          columnSeparators.push({
            type: SeparatorType.None,
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
        case 'h':
          forbidenRegions.push({ row, columnStart: col, columnEnd: col + 1 });
          break;
      }
    } else {
      const value =
        el.kind === 'keyword'
          ? el.value
    : `$f${(el as LineElementContent).value.value}$`;
      signs.push({ value, row, columnStart: col, columnEnd: col + 1 });
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
    const endCol   = nextIndex + 1;

    const currSign = curr.modifier[0];
    const nextSign = next.modifier[0];

    let varType: VariationType;
    if (currSign === '-' && nextSign === '+') {
      varType = VariationType.Increasing;
    } else if (currSign === '+' && nextSign === '-') {
      varType = VariationType.Decreasing;
    } else if (currSign === '+') {
      varType = VariationType.Increasing;
    } else {
      varType = VariationType.Decreasing;
    }

    variationArrows.push({
      type: varType,
      arrowHeadPosition: 'end',
      startColumn: startCol,
      endColumn: endCol,
      row,
    });
  }
}