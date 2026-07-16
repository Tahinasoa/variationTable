import { TkzTabIma } from "../../../parser/types";
import { IntermediateImageLabel, LayoutVariationArrow } from "../../types";

export function processTkzTabIma(cmd: TkzTabIma, variationArrows: LayoutVariationArrow[]): IntermediateImageLabel | null {
    if (!cmd.image) return null;
    let x: number | null = null;
    let y: number | null = null;

    //TkzTab uses 1-based index, and our system uses 0 based index so we should fix that
    const localStart = cmd.startRank - 1;
    const localEnd = cmd.endRank - 1;
    const localPosition = cmd.atRank - 1;

    variationArrows.forEach(arrow => {
        const isStartMatch = arrow.columnSeparatorStart === localStart;
        const isEndMatch = arrow.columnSeparatorEnd === localEnd;


        if (isStartMatch && isEndMatch) {
            const pos = (localPosition - localStart) / (localEnd - localStart);// the relative position
            x = arrow.originalPath.start.x * (1 - pos) + arrow.originalPath.end.x * pos;
            y = arrow.originalPath.start.y * (1 - pos) + arrow.originalPath.end.y * pos;
        }
    })
    if (!x || !y) {
        throw new Error(`Could not process tkzTabIma, it doesn't match to any arrow`);
    }

    return {
        role: "intermediateImage",
        row: 0,
        columnSeparatorStart: localStart,
        columnSeparatorEnd: localEnd,
        position: localPosition,
        value: cmd.image.value,
        anchor: { x, y },
        vPosition: "top",
        hPosition: "center"
    }
}