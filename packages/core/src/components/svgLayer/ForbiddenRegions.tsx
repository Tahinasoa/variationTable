import { ReactElement } from "react";
import { HashPatternId } from "./ArrowHeadDef";
import { LayoutData } from "../../transformer/types";

export function ForbiddenRegions({ layoutData }: { layoutData: LayoutData }) {
    const regions: ReactElement<SVGRectElement>[] = layoutData.forbiddenRegions.map((region,i) => {
        const x = region.bounds.x;
        const y = region.bounds.y;
        const w = region.bounds.width ;
        const h = region.bounds.height ;
        return <rect key={`forbiddenRegion-${i}`}x={x} y={y} width={w} height={h} fill={`url(#${HashPatternId})`} stroke="none" />

    })
    return regions
}