import styles from '../../VariationTable.module.css';
import type { TableData } from '../../models/TableData';

export function Signs({ tableData }: { tableData: TableData }) {
  return (
    <>
      {tableData.signs.map((s, i) => {
        return (
          <span
            key={`sign${i}`}
            style={{
              left: `${tableData.getInterNodeX(s.columnStart, s.columnEnd)}px`,
              top: `${tableData.getInterNodeY(s.row, s.row + 1)}px`,
            }}
            className={styles.katexNode}
          >
            <span className={styles.katexSubNode} >{s.value}</span>
          </span>
        );
      })}
    </>
  );
}
