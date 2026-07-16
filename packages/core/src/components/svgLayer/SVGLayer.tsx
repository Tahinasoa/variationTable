import { LayoutData } from '../../transformer/types';
import styles from '../../VariationTable.module.css';

import { ArrowHeadDef, HashPattern } from './ArrowHeadDef';
import { ColumnSeparators } from './ColumnSeparators';
import { ForbiddenRegions } from './ForbiddenRegions';
import { Grid } from './Grid';
import { VariationArrows } from './VariationArrows';

export function SVGLayer({
  layoutData,
}: {
  layoutData: LayoutData;
}) {
  return (
    <svg
      className={styles.svgLayer}
      viewBox={`0 0 ${layoutData.width} ${layoutData.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {ArrowHeadDef}
      {HashPattern}
      <g
        strokeWidth={layoutData.config.strokeWidth}
        vectorEffect="non-scaling-stroke"
        shapeRendering="crispEdges">
        <Grid layoutData={layoutData}/>
        <ColumnSeparators layoutData={layoutData} />
        <ForbiddenRegions layoutData={layoutData} />
        <VariationArrows
          layoutData={layoutData}
        />
      </g>
    </svg>
  );
}
