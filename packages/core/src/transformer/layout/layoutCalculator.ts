import { TkzTabDocument, TkzTabInit } from "../../parser/types";
import { LayoutConfig } from "../layoutConfig";
import { LayoutData, Segment, LineContentLabel, IntermediateImageLabel, IntermediateAntecedentLabel, LayoutColumnSeparator, LayoutVariationArrow, LayoutForbiddenRegion, ColumnSeparatorLabel } from "../types";
import { processTkzTabLine } from "./commands/processTkzTabLine";
import { processTkzTabVar } from "./commands/processTkzTabVar";
import { getRowBoundaries, getTableWidth } from "./geometry";
import { getColumnHeaders } from "./init/getColumnHeaders";
import { getGrid } from "./init/getGrid";
import { getRowLabels } from "./init/getRowLabels";

export function calculateLayout(ast: TkzTabDocument, config: LayoutConfig): LayoutData {
    if (ast.body[0].type !== "tkzTabInit") {
        throw new Error("tkzTabInit not found");
    }

    const init: TkzTabInit = ast.body[0];

    if (init.rows.length === 0) {
        throw new Error("tkzTabInit must define at least one row");
    }

    if (init.antecedents.length === 0) {
        throw new Error("tkzTabInit must define at least one antecedent (column)");
    }

    init.rows.forEach((row, i) => {
        if (row.height <= 0) {
            throw new Error(`Row ${i} has an invalid height (${row.height}); it must be > 0`);
        }
    });

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
    const forbiddenRegions: LayoutForbiddenRegion[] = [];

    let currentRowIndex = 1; // row 0 is for headers

    ast.body.forEach((cmd) => {
        if (cmd.type === 'tkzTabLine') {
            checkRowCount(currentRowIndex, maxRowIndex);
            const result = processTkzTabLine(cmd, currentRowIndex, rowBoundaries, config);
            lineContents.push(...result.lineContents);
            columnSeparators.push(...result.columnSeparators);
            columnSeparatorLabels.push(...result.columnSeparatorLabels);
            forbiddenRegions.push(...result.forbiddenRegions);
            currentRowIndex++;
        }
        if (cmd.type === 'tkzTabVar') {
            checkRowCount(currentRowIndex, maxRowIndex);
            const result = processTkzTabVar(cmd, currentRowIndex, rowBoundaries, config);
            columnSeparators.push(...result.columnSeparators);
            columnSeparatorLabels.push(...result.columnSeparatorLabels);
            variationArrows.push(...result.variationArrows);
            forbiddenRegions.push(...result.forbiddenRegions);
            currentRowIndex++;
        }
    })

    return {
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

function checkRowCount(currentRowIndex: number, maxRowIndex: number) {
    if (currentRowIndex > maxRowIndex) {
        throw new Error(
            `Row ${currentRowIndex} exceeds the number of declared body rows (${maxRowIndex})`
        );
    }
}