import { TkzTabIma } from "../../../parser/types";
import { makeErrMsg } from "../../makeErrMsg";
import { IntermediateImageLabel, LayoutVariationArrow } from "../../types";

export function processTkzTabIma(cmd: TkzTabIma, variationArrows: LayoutVariationArrow[]): IntermediateImageLabel | null {
    if (!cmd.image) {
        throw new Error(makeErrMsg(
            {
                msg: `Could not process tkzTabIma : missing " image " argument`,
                line: cmd.line,
                column: cmd.column
            }));
        return null;
    }
    let x: number | null = null;
    let y: number | null = null;
    let row:number | null = null ;

    //TkzTab uses 1-based index, and our system uses 0 based index so we should fix that
    const localStart = cmd.startRank - 1;
    const localEnd = cmd.endRank - 1;
    const localPosition = cmd.atRank - 1;
    const pos = (localPosition - localStart) / (localEnd - localStart);// the relative position

    variationArrows.forEach(arrow => {
        const isStartMatch = arrow.columnSeparatorStart === localStart;
        const isEndMatch = arrow.columnSeparatorEnd === localEnd;


        if (isStartMatch && isEndMatch) {
            x = arrow.originalPath.start.x * (1 - pos) + arrow.originalPath.end.x * pos;
            y = arrow.originalPath.start.y * (1 - pos) + arrow.originalPath.end.y * pos;
            row = arrow.row ;
        }
    })
    if (x===null || y===null || row===null) {
        throw new Error(makeErrMsg(
        {
            msg : `Could not process tkzTabIma, it doesn't match to any arrow`,
            line : cmd.line,
            column : cmd.column
        }));
    }

    return {
        role: "intermediateImage",
        row: row,
        columnSeparatorStart: localStart,
        columnSeparatorEnd: localEnd,
        position: pos,
        value: cmd.image.value,
        anchor: { x, y },
        vPosition: "center",
        hPosition: "center"
    }
}