import { SeparatorType, type TableData } from '../../models/TableData';

export function ColumnSeparator({ tableData }: { tableData: TableData }) {
  const columnSeparators: React.ReactElement[] = tableData.columnSeparators
    .map((sep, i) => {
      // Constants at top of component
      const STROKE_WIDTH = 1;
      const DOUBLE_BAR_SPACING = 3;
      const DASH_PATTERN = '5,5';
      if (sep.type === SeparatorType.None) return null;

      const x = tableData.getNodeX(sep.column);
      const y1 = tableData.getNodeY(sep.row);
      const y2 = tableData.getNodeY(sep.row + 1);
      const key = `columnSeparator-${i}`;

      const commonProps = {
        y1,
        y2,
        stroke: 'black',
        strokeWidth: STROKE_WIDTH,
      };

      switch (sep.type) {
        case SeparatorType.SingleBar:
          return <line key={key} x1={x} x2={x} {...commonProps} />;

        case SeparatorType.Dashed:
          return (
            <line
              key={key}
              x1={x}
              x2={x}
              strokeDasharray={DASH_PATTERN}
              {...commonProps}
            />
          );

        case SeparatorType.DoubleBar:
          return (
            <g key={key}>
              <line
                x1={x - DOUBLE_BAR_SPACING}
                x2={x - DOUBLE_BAR_SPACING}
                {...commonProps}
              />
              <line
                x1={x + DOUBLE_BAR_SPACING}
                x2={x + DOUBLE_BAR_SPACING}
                {...commonProps}
              />
            </g>
          );
        case SeparatorType.DoubleDashed:
          return (
            <g key={key}>
              <line
                x1={x - DOUBLE_BAR_SPACING}
                x2={x - DOUBLE_BAR_SPACING}
                strokeDasharray={DASH_PATTERN}
                {...commonProps}
              />
              <line
                x1={x + DOUBLE_BAR_SPACING}
                x2={x + DOUBLE_BAR_SPACING}
                strokeDasharray={DASH_PATTERN}
                {...commonProps}
              />
            </g>
          );

        default:
          return null;
      }
    })
    .filter(Boolean) as React.ReactElement[]; // Remove nulls
  return columnSeparators;
}
