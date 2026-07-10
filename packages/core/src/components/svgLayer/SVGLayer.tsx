import type { TableData } from '../../models/TableData';
import { RowSeparators } from './RowSeparators';
import styles from '../../VariationTable.module.css';

import { ArrowHeadDef, HashPattern } from './ArrowHeadDef';
import { ColumnSeparator } from './ColumnSeparators';
import { TableOutline } from './TableOutline.tsx';
import { VariationArrows } from './VariationArrows.tsx';
import type { MeasuredData } from '../../VariationTable.tsx';
import { ForbiddenRegions } from './ForbiddenRegions.tsx';

export function SVGLayer({
  tableData,
  measuredData,
}: {
  tableData: TableData;
  measuredData: MeasuredData;
}) {
  return (
    <svg
      className={styles.drawing}
      viewBox={`-1 -1 ${tableData.width+2} ${tableData.height+2}`} // The -1 and +2 are to make sure the stroke of the outline is not cut off
      preserveAspectRatio="xMidYMid meet"
    >
      {ArrowHeadDef}
      {HashPattern}
      <ForbiddenRegions tableData={tableData}/>
      <TableOutline tableData={tableData} />
      <RowSeparators tableData={tableData} />
      <ColumnSeparator tableData={tableData} />
      <VariationArrows
        labelGeometry={measuredData.labelGeometry}
        tableData={tableData}
      />
    </svg>
  );
}
