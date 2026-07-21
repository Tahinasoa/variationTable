import { LayoutData, SeparatorType } from "../../transformer/types";

export function ColumnSeparators({ layoutData }: { layoutData: LayoutData }) {
  const columnSeparators: React.ReactElement[] = layoutData.columnSeparators
    .map((sep, i) => {
      const DOUBLE_BAR_SPACING = 1.5;
      const DASH_PATTERN = "2,3";
      if (sep.type === SeparatorType.None) return null;

      const x = sep.position.start.x; // start.x === end.x, it's a vertical segment
      const y1 = sep.position.start.y;
      const y2 = sep.position.end.y;
      const key = `columnSeparator-${sep.row}-${sep.columnSeparatorIndex}-${i}`;

      const commonProps = { y1, y2 };

      switch (sep.type) {
        case SeparatorType.SingleBar:
          return <line key={key} x1={x} x2={x} {...commonProps} />;

        case SeparatorType.Dashed:
          return (
            <line key={key} x1={x} x2={x} strokeDasharray={DASH_PATTERN} {...commonProps} />
          );

        case SeparatorType.DoubleBar:
          return (
            <g key={key}>
              <rect
                x={x - DOUBLE_BAR_SPACING}
                y={y1}
                width={2 * DOUBLE_BAR_SPACING}
                height={y2 - y1}
              />
              <line x1={x - DOUBLE_BAR_SPACING} x2={x - DOUBLE_BAR_SPACING} {...commonProps} />
              <line x1={x + DOUBLE_BAR_SPACING} x2={x + DOUBLE_BAR_SPACING} {...commonProps} />
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

  return <>{columnSeparators}</>;
}