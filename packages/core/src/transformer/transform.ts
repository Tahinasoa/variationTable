import { TkzTabDocument } from '../parser/types';
import { calculateLayout } from './layout/layoutCalculator';
import { LayoutData } from './types';
import { defaultLayoutConfig } from './layoutConfig';
import { makeErrMsg } from './makeErrMsg';
import { parse } from '../parser/parser.mjs';



// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------
export interface ParseToLayoutDataOutPut 
  { layoutData?: LayoutData ; error? : string }
export function parseToLayoutData(input: string): ParseToLayoutDataOutPut{
  let ast: TkzTabDocument;
  try {
    ast = parse(input) ;
  } catch (e: any) {
    const message = makeErrMsg({
      line : e.location.start.line,
      column : e.location.start.column,
      msg : e.message
    })
    return { error: message ?? 'Unknown parse error' };
  }
  try {
    return { layoutData: calculateLayout(ast,defaultLayoutConfig) };
  } catch (e: any) {
    return { error: e.message ?? 'Unknown calculateLayout error' };
  }
}