export const ArrowHeadDef = (
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
);

export const ArrowHeadId = "arrowhead";

export const HashPatern = (
  <defs>
    <pattern
      id="hashPattern"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <rect width="10" height="10" fill="white" />
      <path d="M0,0 l10,10 M10,0 l-10,10" stroke="#000" stroke-width="1" />
    </pattern>
  </defs>
);

export const HashPaternId = "hashPattern";
