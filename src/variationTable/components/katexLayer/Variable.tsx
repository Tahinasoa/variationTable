import type { TableData } from '../../models/TableData';
import styles from '../../VariationTable.module.css';

export function Variable({ tableData }: { tableData: TableData }) {
  if (!tableData.variable) return null;

  return (
    <span
      key="variable"
      style={{
        left: `${tableData.getInterNodeX(0, 1)}px`,
        top: `${tableData.getInterNodeY(0, 1)}px`,
      }}
      className={styles.katexNode}
    >
      <span className={styles.katexSubNode} >{tableData.variable}</span>
    </span>
  );
}
