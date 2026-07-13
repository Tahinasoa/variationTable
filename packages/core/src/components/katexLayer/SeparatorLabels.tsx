import styles from '../../VariationTable.module.css';
import { HorizontalPosition, VerticalPosition, type TableData } from '../../models/TableData';
export interface SeparatorLabelRef {
  type: 'separatorLabel';
  row: number;
  column: number;
  vpos: VerticalPosition;
  hpos: HorizontalPosition;
  node: HTMLSpanElement;
}

export function SeparatorLabels({ tableData, labelrefs }: { tableData: TableData, labelrefs : Map<string, SeparatorLabelRef>}) {
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
            const key = `separatorLabel-${i}-${j}`;
            return (
              <span
                key={key}
                ref={(node) => {
                  if (node) {
                    labelrefs.set(key, {type:'separatorLabel', row: sep.row, column: sep.column, vpos: lbl.vPosition, hpos: lbl.hPosition, node: node });
                  }
                  else {
                    labelrefs.delete(key);
                  }
                }}
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
