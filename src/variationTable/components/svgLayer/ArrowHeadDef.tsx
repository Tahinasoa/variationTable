export const ArrowHeadDef = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <marker
        id="arrowhead"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
        markerUnits="userSpaceOnUse"
      >
        <path d="M 0 0 L 10 5 L 0 10 L 3 5 z" fill="black" />
      </marker>
    </defs>
  </svg>
);

export const ArrowHeadId = 'arrowhead';
