import type { TableData } from '../../models/TableData';
import { RowSeparators } from './RowSeparators';
import styles from '../../VariationTable.module.css';

import { ArrowHeadDef, HashPatern } from './ArrowHeadDef';
import { ColumnSeparator } from './ColumnSeparators';
import { TableOutline } from './TableOutline.tsx';
import { VariationArrows } from './VariationArrows.tsx';
import type { MeasuredData } from '../../VariationTable.tsx';
import { ForbidenRegions } from './ForbidenRegions.tsx';

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
      viewBox={`0 0 ${tableData.width} ${tableData.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {ArrowHeadDef}
      {HashPatern}
      <TableOutline tableData={tableData} />
      <RowSeparators tableData={tableData} />
      <ColumnSeparator tableData={tableData} />
      <VariationArrows
        labelGeometry={measuredData.labelGeometry}
        tableData={tableData}
      />
      <ForbidenRegions tableData={tableData}/>
    </svg>
  );
}
