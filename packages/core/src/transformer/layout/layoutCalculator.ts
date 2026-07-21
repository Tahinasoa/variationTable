import { TkzTabDocument, TkzTabInit } from "../../parser/types";
import { LayoutConfig } from "../layoutConfig";
import { makeErrMsg } from "../makeErrMsg";
import { LayoutData, Segment, LineContentLabel, IntermediateImageLabel, IntermediateAntecedentLabel, LayoutColumnSeparator, LayoutVariationArrow, LayoutForbiddenRegion, ColumnSeparatorLabel } from "../types";
import { processTkzTabIma } from "./commands/processTkzTabIma";
import { processTkzTabLine } from "./commands/processTkzTabLine";
import { processTkzTabVal } from "./commands/processTkzTabVal";
import { processTkzTabVar } from "./commands/processTkzTabVar";
import { getRowBoundaries, getTableWidth } from "./geometry";
import { getColumnHeaders } from "./init/getColumnHeaders";
import { getGrid } from "./init/getGrid";
import { getRowLabels } from "./init/getRowLabels";

export function calculateLayout(ast: TkzTabDocument, defaultLayoutConfig: LayoutConfig): LayoutData {

    if (ast.body.length === 0 || ast.body[0].type !== "tkzTabInit") {
        throw new Error(makeErrMsg({ line: 1, column: 1, msg: "tkzTabInit not found" }));
    }

    const init: TkzTabInit = ast.body[0];
    if (init.rows.length === 0) {
        throw new Error(makeErrMsg({ line: init.line, column: init.column, msg: "tkzTabInit must define at least one row" }));
    }

    if (init.antecedents.length === 0) {
        throw new Error(makeErrMsg({ line: init.line, column: init.column, msg: "tkzTabInit must define at least one antecedent (column)" }));
    }

    init.rows.forEach((row, i) => {
        if (row.height <= 0) {
            const msg = `Row ${i} has an invalid height (${row.height}); it must be > 0`;
            throw new Error(makeErrMsg({ line: init.line ?? init.line, column: init.column ?? init.column, msg: msg }));
        }
    });

    
    const config:LayoutConfig = {...defaultLayoutConfig} ;
    const rowBoundaries = getRowBoundaries(init.rows, config);
    const maxRowIndex = init.rows.length - 1; // max body row index (row 0 is the header)
    const antecedentCount = init.antecedents.length;
    const width = getTableWidth(antecedentCount, config);
    const height = rowBoundaries[rowBoundaries.length - 1];

    const grid: Segment[] = getGrid(width, rowBoundaries, config);
    const rowLabels = getRowLabels(init.rows, config);
    const headerRowHeightMultipier = init.rows[0].height;
    const columnHeaders = getColumnHeaders(init.antecedents, config, headerRowHeightMultipier);
    const lineContents: LineContentLabel[] = [];
    const intermediateImages: IntermediateImageLabel[] = [];
    const intermediateAntecedents: IntermediateAntecedentLabel[] = [];
    const columnSeparators: LayoutColumnSeparator[] = [];
    const columnSeparatorLabels: ColumnSeparatorLabel[] = [];
    const variationArrows: LayoutVariationArrow[] = [];
    let lastVariationArrows:LayoutVariationArrow[] = [] ; //store the last variationArrow for tkzTabIma and tkzTabVal
    const forbiddenRegions: LayoutForbiddenRegion[] = [];

    let currentRowIndex = 1; // row 0 is for headers

    ast.body.forEach((cmd) => {
        if (cmd.type === 'tkzTabLine') {
            checkRowCount(currentRowIndex, maxRowIndex, cmd.line, cmd.column);
            const result = processTkzTabLine(cmd, currentRowIndex, rowBoundaries, config);
            lineContents.push(...result.lineContents);
            columnSeparators.push(...result.columnSeparators);
            columnSeparatorLabels.push(...result.columnSeparatorLabels);
            forbiddenRegions.push(...result.forbiddenRegions);
            lastVariationArrows = [] ; //make sure any tkzTabIma and tkzTabVal won't work with wrong data.
            currentRowIndex++;
        }
        else if (cmd.type === 'tkzTabVar') {
            checkRowCount(currentRowIndex, maxRowIndex);
            const result = processTkzTabVar(cmd, currentRowIndex, rowBoundaries, config);
            columnSeparators.push(...result.columnSeparators);
            columnSeparatorLabels.push(...result.columnSeparatorLabels);
            variationArrows.push(...result.variationArrows);
            forbiddenRegions.push(...result.forbiddenRegions);
            lastVariationArrows = [...result.variationArrows] ;//Keep it for tkzTabIma and tkzTabVal
            currentRowIndex++;
        }
        else if(cmd.type === 'tkzTabIma'){
            const result = processTkzTabIma(cmd, lastVariationArrows) ;
            if(result){
                intermediateImages.push(result) ;
            }
        }
        else if(cmd.type === 'tkzTabVal'){
            const result = processTkzTabVal(cmd, lastVariationArrows,rowBoundaries) ;
            if(result.image){
                intermediateImages.push(result.image) ;
            }
            if(result.antecedent){
                intermediateAntecedents.push(result.antecedent) ;
            }
        }
    })

    return {
        id : Math.ceil(Math.random()*1000),//an unique ID per parse.
        config,
        width,
        height,
        rowLabels,
        columnHeaders,
        lineContents,
        intermediateImages,
        intermediateAntecedents,
        columnSeparators,
        columnSeparatorLabels,
        variationArrows,
        forbiddenRegions,
        grid,
    };
}

function checkRowCount(currentRowIndex: number, maxRowIndex: number,line:number,column:number) {
    if (currentRowIndex > maxRowIndex) {
        throw new Error(
            makeErrMsg({
                line : line,
                column : column,
                msg :  `Row ${currentRowIndex} exceeds the number of declared body rows (${maxRowIndex})`
            })
        );
    }
}