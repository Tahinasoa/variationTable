
import { TkzTabDocument, TkzTabInit } from "../../parser/types";
import { LayoutConfig } from "../layoutConfig";
import { processTkzTabLine } from "./commands/processTkzTabLine";
import { getRowBoundaries, getTableWidth } from "./geometry";
import { getColumnHeaders } from "./init/getColumnHeaders";
import { getGrid } from "./init/getGrid";
import { getRowLabels } from "./init/getRowLabels";
import { IntermediateAntecedentLabel, IntermediateImageLabel, LayoutColumnSeparator, LayoutData, LayoutForbiddenRegion, LayoutVariationArrow, LineContentLabel, Segment } from "./types";

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
    const variationArrows: LayoutVariationArrow[] = [];
    const forbiddenRegions: LayoutForbiddenRegion[] = [];

    let currentRowIndex = 1; // as row (0) is for headers ;
    ast.body.forEach((cmd, i) => {
        if (cmd.type === 'tkzTabLine') {
            processTkzTabLine(cmd, currentRowIndex, config, rowBoundaries);
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
        variationArrows,
        forbiddenRegions,
        grid,
    };
}