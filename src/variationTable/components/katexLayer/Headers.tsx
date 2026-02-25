import type { TableData } from "../../models/TableData";
import styles from "../../VariationTable.module.css";

export function Headers({ tableData }: { tableData: TableData }) {
  /* Render headers : the values of 'x' */
  const headers: React.ReactElement[] = [];
  headers.push(
    ...tableData.columnHeaders.map((value, i, headers) => {
      let className = styles.katexNode;
      if (i === 0) {
        className = `${styles.katexNode} ${styles.katexNodeLeftAligned}`;
      } else if (i === headers.length - 1) {
        className = `${styles.katexNode} ${styles.katexNodeRightAligned}`;
      }
      return (
        <span
          key={`header${i}`}
          style={{
            left: `${tableData.getNodeX(i + 1)}px`,
            top: `${tableData.getInterNodeY(0, 1)}px`,
          }}
          className={className}
        >
          <span className={styles.katexSubNode}>{value}</span>
        </span>
      );
    })
  );
  return headers;
}
