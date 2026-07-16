import { LayoutData } from "../../transformer/types";

export interface GridProps {
  layoutData: LayoutData;
}

export function Grid({ layoutData }: GridProps) {
  const { grid} = layoutData;

  return (
    <g>
      {grid.map((segment, i) => (
        <line
          key={i}
          x1={segment.start.x}
          y1={segment.start.y}
          x2={segment.end.x}
          y2={segment.end.y}
        />
      ))}
    </g>
  );
}