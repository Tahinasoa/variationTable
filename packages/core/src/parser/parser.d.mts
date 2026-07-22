import {TkzTabDocument} from "./types";

declare module "../parser/parser.mjs" {
    export function parse(input: string, options?: any): TkzTabDocument;
}