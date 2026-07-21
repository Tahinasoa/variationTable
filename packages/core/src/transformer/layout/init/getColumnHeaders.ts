import { LatexExpression } from "../../../parser/types";
import { LayoutConfig } from "../../layoutConfig";
import { ColumnHeaderLabel, HorizontalPosition } from "../../types";
import { getNodeX } from "../geometry";


export function getColumnHeaders(headers: LatexExpression[], config: LayoutConfig,heightMultiplier:number): ColumnHeaderLabel[] {
    const y = config.headerRowHeight*heightMultiplier/2 ;
    return headers.map((header, i) => {
        const x = getNodeX(i,config)
        let hPosition: HorizontalPosition = 'center';
        if (i === 0) hPosition = 'right';
        else if (i === headers.length - 1) hPosition = 'left';

        return {
            role : 'columnHeader',
            columnSeparatorIndex : i,
            value : header.value ,
            anchor : {x,y},
            vPosition : 'center',
            hPosition : hPosition
        };
    }) ;
}