import type { TableData } from '../../models/TableData';
import styles from '../../VariationTable.module.css';

export function RowLabels({ tableData }: { tableData: TableData }) {
  const rowLabels: React.ReactElement[] = tableData.rowLabels.map(
    /* Render the katex node of the first column*/
    (value, i) => (
      <span
        key={`label${i}`}
        style={{
          left: `${tableData.getInterNodeX(0, 1)}px`,
          top: `${tableData.getInterNodeY(i + 1, i + 2)}px`,
          width: `${tableData.labelColumnWidth}px`,
        }}
        className={styles.katexNode}
      >
        <span className={styles.katexSubNode}>{value.content}</span>
      </span>
    )
  );
  return rowLabels;
}
