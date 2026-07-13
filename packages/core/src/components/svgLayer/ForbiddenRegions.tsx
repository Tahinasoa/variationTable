import { ReactElement } from "react";
import { TableData } from "../../models/TableData";
import { HashPatternId } from "./ArrowHeadDef";

export function ForbiddenRegions({ tableData }: { tableData: TableData }) {
    const regions: ReactElement<SVGRectElement>[] = tableData.forbiddenRegions.map((value) => {
        const x1 = tableData.getNodeX(value.columnStart);
        const x2 = tableData.getNodeX(value.columnEnd);
        const y1 = tableData.getNodeY(value.row);
        const y2 = tableData.getNodeY(value.row + 1);

        return <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={`url(#${HashPatternId})`} stroke="none" />

    })
    return regions
}