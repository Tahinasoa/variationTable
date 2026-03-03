import styles from '../../VariationTable.module.css';
import { type TableData } from '../../models/TableData';

export function SeparatorLabels({ tableData }: { tableData: TableData }) {
  const columnSeparatorLabel = 'columnSeparatorLabel';
  return (
    <>
      {tableData.columnSeparators.map((sep, i) => {
        return sep.labels?.map((lbl, j) => {
          let left: number = tableData.getNodeX(sep.column),
            top: number,
            className: string = columnSeparatorLabel + ' ' + styles.katexNode;
          switch (lbl.vPosition) {
            case 'top':
              top =
                tableData.getNodeY(sep.row) + tableData.LabelsTopBottomMargin;
              className += ' ' + styles.katexNodeTopAligned;
              break;
            case 'bottom':
              top =
                tableData.getNodeY(sep.row + 1) -
                tableData.LabelsTopBottomMargin;
              className += ' ' + styles.katexNodeBottomAligned;
              break;
            default:
              top = tableData.getInterNodeY(sep.row, sep.row + 1); //center
          }

          switch (lbl.hPosition) {
            /*
            Left and right are exchanged here because
            * if it is placed at the left, it is right aligned
            * and if it is placed at the right it is left aligned
            */
            case 'left':
              className += ' ' + styles.katexNodeRightAligned;
              break;
            case 'right':
              className += ' ' + styles.katexNodeLeftAligned;
              break;
            default:
              break;
          }
          return (
            <span
              key={`label-${i}-${j}`}
              data-row={sep.row}
              data-column={sep.column}
              data-vpos={lbl.vPosition}
              data-hpos={lbl.hPosition}
              style={{
                left: `${left}px`,
                top: `${top}px`,
              }}
              className={className}
            >
              <span className={styles.katexSubNode}>{lbl.value}</span>
            </span>
          );
        });
      })}
    </>
  );
}
