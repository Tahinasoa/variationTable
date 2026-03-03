import type { TableData } from '../../models/TableData';

export function RowSeparators({ tableData }: { tableData: TableData }) {
  const rowSeparators: React.ReactElement[] = [];
  for (let i = 1; i <= tableData.rowCount; i++) {
    rowSeparators.push(
      <line
        x1={0}
        y1={tableData.getNodeY(i)}
        x2={tableData.width}
        y2={tableData.getNodeY(i)}
        stroke="black"
        key={i}
      />
    );
  }
  return rowSeparators;
}
