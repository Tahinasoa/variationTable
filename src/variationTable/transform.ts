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
  ColumnSeparatorLabel,
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

 
  for (let i = 0; i < elements.length; i++) {
    const curr = elements[i];

    //  ----------------------------------------------------
    // Process separators and associated labels
    //  ----------------------------------------------------
    const modifier = curr.modifier;
    const plusCount = modifier.split('').filter(c => c === '+').length;
    const minusCount = modifier.split('').filter(c => c === '-').length;
    const signCount = plusCount + minusCount;
    if (signCount === 0 || signCount > 2) {
      throw new Error(`Unsupported modifier ${curr.modifier} for variation element at row ${row}, column ${i + 1}`);
    }

    /*
    Groupe 1 — un seul expression 
    +, -, +C, -C, +D, -D, D+, D-, +DH, -DH, +CH, -CH, +H, -H, R
      → 15 cas
    Groupe 2 — deux expressions distincts 
    +D-, -D+, +D+, -D-, +CD+, -CD-, +CD-, -CD+, +DC+, -DC-, +DC-, -DC+, +V+, -V-, +V-, -V+
      → 16 cas
    Total : 31 cas, dont R qui est le seul à ne rien dessiner du tout.

    */

    if (modifier === "R") {
      // Skip element, do nothing
    }

    //Groupe 1 — un seul expression 
    else if (modifier === "+" || modifier === "-") {
      columnSeparators.push(
        {
          type: SeparatorType.None,
          column: i + 1, row,
          labels: makeLabel(curr.left?.value, modifier === '+' ? 'top' : 'bottom', 'center')
        }
      );
    }
    else if(modifier === "+C" || modifier === "-C") {
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+C' ? 'top' : 'bottom', 'center')
        }
      );
    }
    else if(modifier === "+D" || modifier === "-D") {
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+D' ? 'top' : 'bottom', 'left')
        }
      );
    }
        else if(modifier === "D+" || modifier === "D-") {
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === 'D+' ? 'top' : 'bottom', 'right')
        }
      );
    }
    else if(modifier === "+CH" || modifier === "-CH") {
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+CH' ? 'top' : 'bottom', 'center')
        }
      );
    }
    else if(modifier === "+DH" || modifier === "-DH") {
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+DH' ? 'top' : 'bottom', 'left')
        }
      );
    }
    else if(modifier === "+H" || modifier === "-H") {
      columnSeparators.push(
        {
          type: SeparatorType.None,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+H' ? 'top' : 'bottom', 'center')
        }
      );
    }
    
    // Groupe 2 — deux expressions distincts 
    else if (/^[+-](D|CD|DC|V)[+-]$/.test(modifier)) {
      const firstSign = modifier[0];
      const secondSign = modifier[modifier.length - 1];
      const type = modifier.slice(1, -1);
      const separatorType = type === 'V' ? SeparatorType.None : SeparatorType.DoubleBar;

      const firstLabelVPosition = firstSign === '+' ? 'top' : 'bottom';
      const secondLabelVPosition = secondSign === '+' ? 'top' : 'bottom';
      const firstLabelHPosition = type === 'CD' ? 'center' : 'left';
      const secondLabelHPosition = type === 'DC' ? 'center' : 'right';
      const firstLabelValue = curr.left?.value ?? '';
      const secondLabelValue = curr.right?.value ?? '';
      const firstLabel = makeLabel(firstLabelValue, firstLabelVPosition, firstLabelHPosition);
      const secondLabel = makeLabel(secondLabelValue, secondLabelVPosition, secondLabelHPosition);
      const labels = [...firstLabel, ...secondLabel];
      columnSeparators.push({
        type: separatorType,
        column: i + 1,
        row,
        labels,
      });

    }
    else {
      throw new Error(`Unsupported modifier ${curr.modifier} for variation element at row ${row}, column ${i + 1}`);
    }
  }
}

function makeLabel(value: string | undefined, vPos: 'top' | 'bottom', hPos: 'left' | 'center' | 'right'): ColumnSeparatorLabel[] {
  if (!value) return [];
  return [{ value, vPosition: vPos, hPosition: hPos }];
}
// //