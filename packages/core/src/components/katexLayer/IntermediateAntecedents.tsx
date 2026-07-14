import type { TableData } from '../../models/TableData';
import styles from '../../VariationTable.module.css';

export function IntermediateAntecedents({ tableData }: { tableData: TableData }) {
    const intermediateAntecedents: React.ReactElement[] = tableData.intermediateAntecedents.map(
            (value, i) => (
      <span
        key={`antecend_${i}`}
        style={{
          left: `${tableData.getInterNodeX(value.columnStart,value.columnEnd,value.position)}px`,
          top: `${tableData.getInterNodeY(0,1)}px`,
        }}
        className={styles.katexNode}
      >
        <span className={styles.katexSubNode}>{value.value}</span>
      </span>
    )
    );

    return intermediateAntecedents;
}