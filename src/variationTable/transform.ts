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
  type ForbiddenRegion,
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

  const init: TkzTabInit = ast.body[0];

  const variable = init.rows[0]?.label.value ?? null;
  const rowLabels: RowData[] = init.rows.slice(1).map(r => ({
    content: r.label.value,
    heightMultiplier: r.height,
  }));

  const columnHeaders = init.antecedents.map(a => a.value);
  const initRowCount = init.rows.length - 1; //


  const columnSeparators: ColumnSeparator[] = [];
  const variationArrows: VariationArrow[] = [];
  const signs: Sign[] = [];
  const forbiddenRegions: ForbiddenRegion[] = [];

  // Parcours dans l'ordre du document
  let row = 0;

  function checkRowCount(currentRow: number, initRowCount: number) {

    if (currentRow > initRowCount) {
      throw new Error(`Row ${currentRow} exceeds the number of headers (${initRowCount})`);
    }
  }


  ast.body.forEach(cmd => {
    if (cmd.type === 'tkzTabLine') {
      row++;
      checkRowCount(row, initRowCount);
      processLine(cmd, row, columnSeparators, signs, forbiddenRegions);
    } else if (cmd.type === 'tkzTabVar') {
      row++;
      checkRowCount(row, initRowCount);
      processVar(cmd, row, variationArrows, columnSeparators, forbiddenRegions);
    }
  });

  return { variable, rowLabels, columnHeaders, columnSeparators, variationArrows, signs, forbiddenRegions };
}

// ---------------------------------------------------------------------------
// Process \tkzTabLine
// ---------------------------------------------------------------------------

function processLine(
  line: TkzTabLine,
  row: number,
  columnSeparators: ColumnSeparator[],
  signs: Sign[],
  forbiddenRegions: ForbiddenRegion[],
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
        forbiddenRegions.push({ row, columnStart: col, columnEnd: col + 1 });
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
  forbiddenRegions: ForbiddenRegion[],
) {
  const elements = varCmd.elements;
  let currSign: { column: number; left: '+' | '-', right?: '+' | '-' } | null = null;
  let lastSign: { column: number; left: '+' | '-', right?: '+' | '-' } | null = null;
  let isForbiddenRegion = false ;
  for (let i = 0; i < elements.length; i++) {
    const curr = elements[i];

    //  ----------------------------------------------------
    // Process separators and associated labels
    //  ----------------------------------------------------
    const simpleModifiers = ['+', '-', '+C', '-C', '+D', '-D', 'D+', 'D-', '+DH', '-DH', '+CH', '-CH', '+H', '-H', 'R'];
    const doubleModifiers = ['+D-', '-D+', '+D+', '-D-', '+CD+', '-CD-', '+CD-', '-CD+', '+DC+', '-DC-', '+DC-', '-DC+', '+V+', '-V-', '+V-', '-V+'];

    if (!simpleModifiers.includes(curr.modifier) && !doubleModifiers.includes(curr.modifier) && curr.modifier !== 'R') {
      throw new Error(`Unsupported modifier ${curr.modifier} for variation element at row ${row}, column ${i + 1}`);
    }

    const modifier = curr.modifier;
    if (simpleModifiers.includes(modifier)) {
      currSign = modifier.includes('+') ? { column: i + 1, left: '+' } : (modifier.includes('-') ? { column: i + 1, left: '-' } : null);
    }
    else if (doubleModifiers.includes(modifier)) {
      const currentLeftSign = modifier[0] as "+" | "-";
      const currentRightSign = modifier[modifier.length - 1] as "+" | "-";
      currSign = { column: i + 1, left: currentLeftSign, right: currentRightSign };
    }

    const plusCount = modifier.split('').filter(c => c === '+').length;
    const minusCount = modifier.split('').filter(c => c === '-').length;
    const signCount = plusCount + minusCount;
    if ((signCount === 0 || signCount > 2) && modifier !== 'R') {
      throw new Error(`Unsupported modifier ${curr.modifier} for variation element at row ${row}, column ${i + 1}`);
    }

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
    else if (modifier === "+C" || modifier === "-C") {
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+C' ? 'top' : 'bottom', 'center')
        }
      );
    }
    else if (modifier === "+D" || modifier === "-D") {
      const label = curr.left?.value;
      console.log(curr)
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(label, modifier === '+D' ? 'top' : 'bottom', 'left')
        }
      );
    }
    else if (modifier === "D+" || modifier === "D-") {
      const label = curr.left?.value;
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(label, modifier === 'D+' ? 'top' : 'bottom', 'right')
        }
      );
    }
    else if (modifier === "+CH" || modifier === "-CH") {
      forbiddenRegions.push({ row, columnStart: i + 1, columnEnd: i + 2 });
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(curr.left?.value, modifier === '+CH' ? 'top' : 'bottom', 'center')
        }
      );
    }
    else if (modifier === "+DH" || modifier === "-DH") {
      const label = curr.left?.value;
      forbiddenRegions.push({ row, columnStart: i + 1, columnEnd: i + 2 });
      columnSeparators.push(
        {
          type: SeparatorType.DoubleBar,
          column: i + 1,
          row,
          labels: makeLabel(label, modifier === '+DH' ? 'top' : 'bottom', 'left')
        }
      );
    }
    else if (modifier === "+H" || modifier === "-H") {
      forbiddenRegions.push({ row, columnStart: i + 1, columnEnd: i + 2 });
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
      const type = modifier.slice(1, -1);
      const separatorType = type === 'V' ? SeparatorType.None : SeparatorType.DoubleBar;

      const firstLabelVPosition = currSign?.left === '+' ? 'top' : 'bottom';
      const secondLabelVPosition = currSign?.right === '+' ? 'top' : 'bottom';
      const firstLabelHPosition = type === 'CD' ? 'center' : 'left';
      const secondLabelHPosition = type === 'DC' ? 'center' : 'right';
      const firstLabelValue = curr.left?.value ?? '';
      const secondLabelValue = curr.right?.value ?? "";
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


    //-----------------------------------------------------------
    // Process variation arrows
    //-----------------------------------------------------------
    if (!isForbiddenRegion && currSign !== null && lastSign !== null) {
      if (currSign.left === '+' && lastSign.right === '-') {
        variationArrows.push({
          type: VariationType.Increasing,
          arrowHeadPosition: 'end',
          startColumn: lastSign.column,
          endColumn: currSign.column,
          row,
        });
      }
      else if (currSign.left === '-' && lastSign.right === '+') {
        variationArrows.push({
          type: VariationType.Decreasing,
          arrowHeadPosition: 'end',
          startColumn: lastSign.column,
          endColumn: currSign.column,
          row,
        });
      }
      else if (currSign.left === '+' && lastSign.right === '+') {
        variationArrows.push({
          type: VariationType.Constant,
          arrowHeadPosition: 'end',
          startColumn: lastSign.column,
          endColumn: currSign.column,
          position : "top",
          row,
        });
      }
      else if (currSign.left === '-' && lastSign.right === '-') {
        variationArrows.push({
          type: VariationType.Constant,
          arrowHeadPosition: 'end',
          startColumn: lastSign.column,
          endColumn: currSign.column,
          position : "bottom",
          row,
        });
      }
    }

    isForbiddenRegion = modifier.includes("H") ;
    if (currSign) {
      lastSign = { ...currSign }
      if (!currSign.right) {
        lastSign.right = currSign.left;
      }
    }
  }
}

function makeLabel(value: string | undefined, vPos: 'top' | 'bottom', hPos: 'left' | 'center' | 'right'): ColumnSeparatorLabel[] {
  if (!value) return [];
  return [{ value, vPosition: vPos, hPosition: hPos }];
}
// //