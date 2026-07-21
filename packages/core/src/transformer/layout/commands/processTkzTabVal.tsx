import { TkzTabVal } from "../../../parser/types";
import { makeErrMsg } from "../../makeErrMsg";
import { IntermediateAntecedentLabel, IntermediateImageLabel, LayoutVariationArrow } from "../../types";
import { getInterNodeY } from "../geometry";

export function processTkzTabVal(cmd: TkzTabVal, variationArrows: LayoutVariationArrow[], rowBoundaries: number[]): { image: IntermediateImageLabel | null, antecedent: IntermediateAntecedentLabel | null } {
    let image: IntermediateImageLabel | null = null;
    let antecedent: IntermediateAntecedentLabel | null = null;
    
    //TkzTab uses 1-based index, and our system uses 0 based index so we should fix that
    const localStart = cmd.startRank - 1;
    const localEnd = cmd.endRank - 1;

    const matchingArrow = variationArrows.find(arrow =>
        arrow.columnSeparatorStart === localStart && arrow.columnSeparatorEnd === localEnd
    );

    if (!matchingArrow) {
        throw new Error( makeErrMsg({
            line : cmd.line,
            column : cmd.column,
            msg : `Could not process tkzTabVal, it doesn't match to any arrow`
        })) ;
        
    }

    const x = matchingArrow.originalPath.start.x * (1 - cmd.position) + matchingArrow.originalPath.end.x * cmd.position;
    const img_y = matchingArrow.originalPath.start.y * (1 - cmd.position) + matchingArrow.originalPath.end.y * cmd.position;
    const row = matchingArrow.row ;
    const ant_y = getInterNodeY(0,1,rowBoundaries);



    if (cmd.image && cmd.image.value) {
        image = {
            role: "intermediateImage",
            row: row,
            columnSeparatorStart: localStart,
            columnSeparatorEnd: localEnd,
            position: cmd.position,
            value: cmd.image.value,
            anchor: { x, y: img_y },
            vPosition: "center",
            hPosition: "center"
        }
    }

    if (cmd.antecedent && cmd.antecedent.value) {
        antecedent = {
            role: "intermediateAntecedent",
            row: row,
            columnSeparatorStart: localStart,
            columnSeparatorEnd: localEnd,
            position: cmd.position,
            value: cmd.antecedent.value,
            anchor: { x, y: ant_y },
            vPosition: "center",
            hPosition: "center"
        }
    }

    return { image, antecedent }
}