import type { TableData } from '../../models/TableData';
import { MeasuredData } from '../../VariationTable';
import styles from '../../VariationTable.module.css';

export function IntermediateImages({ tableData, measuredData }: { tableData: TableData; measuredData: MeasuredData }) {
    const intermediateImages: React.ReactElement[] = tableData.intermediateImages.map(
        (value, i) => {
            const top = tableData.getInterNodeY(value.row, value.row + 1, value.position);
            const left = tableData.getInterNodeX(value.columnStart, value.columnEnd, value.position);
            for(let label of measuredData.labelGeometry ?? []){
                if(label.row === value.row && label.column === value.columnStart){
                    
                    }
                }
           return (<span
                key={`image_${i}`}
                style={{
                    left: `${left}px`,
                    top: `${top}px`,
                }}
                className={styles.katexNode}
            >
                <span className={styles.katexSubNode}>{value.value}</span>
            </span>)
            }
        );

    return intermediateImages;
} ;