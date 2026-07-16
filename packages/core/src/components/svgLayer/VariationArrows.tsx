import { LayoutData } from "../../transformer/types";
import { ArrowHeadId } from "./ArrowHeadDef";

export function VariationArrows({
layoutData
}: {
  layoutData : LayoutData
}):React.ReactNode {
  const arrows = layoutData.variationArrows.map((arrow,index)=>{
    const path = arrow.correctPath || arrow.originalPath ;
    const x1 =path.start.x ;
    const y1 =path.start.y ;
    const x2 =path.end.x ;
    const y2 =path.end.y
    return <line key={`arrow-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={`url(#${ArrowHeadId})`} shapeRendering="geometricPrecision"/>
  })

  return <>{arrows}</>;
}