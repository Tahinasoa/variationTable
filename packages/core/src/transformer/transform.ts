import { TkzTabDocument } from '../parser/types';
import { calculateLayout } from './layout/layoutCalculator';
import { LayoutData } from './types';
import { defaultLayoutConfig } from './layoutConfig';
import { parse } from '../parser/parser.mjs';


// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

export function parseToLayoutData(input: string): { layoutData?: LayoutData ; error? : string } {
  let ast: TkzTabDocument;
  try {
    ast = parse(input) as TkzTabDocument;
  } catch (e: any) {
    return { error: e.message ?? 'Unknown parse error' };
  }
  try {
    return { layoutData: calculateLayout(ast,defaultLayoutConfig) };
  } catch (e: any) {
    return { error: e.message ?? 'Unknown calculateLayout error' };
  }
}