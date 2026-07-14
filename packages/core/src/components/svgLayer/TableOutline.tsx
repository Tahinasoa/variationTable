import type { TableData } from '../../models/TableData';

export function TableOutline({ tableData }: { tableData: TableData }) {
  return (
    <>
      <rect
        x="0.25"
        y="0.25"
        width={tableData.width-0.5}
        height={tableData.height-0.5}
        fill="none"
      />

      {/* first column separator*/}
      <line
        x1={tableData.labelColumnWidth}
        y1={0}
        x2={tableData.labelColumnWidth}
        y2={tableData.height}
      />
    </>
  );
}
