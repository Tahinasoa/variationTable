import { TkzTabRow } from "../../../parser/types";
import { LayoutConfig } from "../../layoutConfig";
import { RowLabel } from "../../types";

export function getRowLabels(rows:TkzTabRow[], config:LayoutConfig) : RowLabel[]{

    let currentRowTop = 0 ;
    return rows.map((tkzTabRow,i)=>{
        const baserowHeight = i==0?config.headerRowHeight:config.baseRowHeight ;
        const rowBottom = currentRowTop + tkzTabRow.height*baserowHeight ;
        const y = (currentRowTop + rowBottom)/2 ;
        currentRowTop = rowBottom ;

        const width = config.labelColumnWidth;
        const x = width/2 ;
        return {
            role : 'rowLabel',
            row : i,
            value : tkzTabRow.label.value,
            anchor : {x,y},
            vPosition : 'center',
            hPosition  : 'center',
            maxWidth : width
        }
    }) ;
}