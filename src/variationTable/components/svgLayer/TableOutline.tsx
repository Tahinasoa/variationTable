import type { TableData } from '../../models/TableData';

export function TableOutline({ tableData }: { tableData: TableData }) {
  return (
    <>
      <rect
        x="0"
        y="0"
        width={tableData.width}
        height={tableData.height}
        fill="none"
        stroke="black"
      />

      {/* first column separator*/}
      <line
        x1={tableData.labelColumnWidth}
        y1={0}
        x2={tableData.labelColumnWidth}
        y2={tableData.height}
        stroke="black"
      />
    </>
  );
}
