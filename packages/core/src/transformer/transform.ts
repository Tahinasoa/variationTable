import { TkzTabDocument } from '../parser/types';
import { calculateLayout } from './layout/layoutCalculator';
import { LayoutData } from './types';
import { defaultLayoutConfig } from './layoutConfig';
import { parse } from '../parser/parser.mjs';
import { makeErrMsg } from './makeErrMsg';



// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------
export interface ParseToLayoutDataOutPut 
  { layoutData?: LayoutData ; error? : string }
export function parseToLayoutData(input: string): ParseToLayoutDataOutPut{
  let ast: TkzTabDocument;
  try {
    ast = parse(input) as TkzTabDocument;
  } catch (e: any) {
    console.log({...e}) ;
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