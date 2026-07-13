export let examples: Record<string, string> = {};

examples['default'] = `\\begin{tikzpicture}
  \\tkzTabInit
    {$x$ / 1, $x^2 - 1$ / 1, $x + 2$ / 1, $\\frac{x^2-1}{x+2}$ / 1.5}
    {$-\\infty$, $-2$, $-1$, $1$}
  \\tkzTabLine{, -, d, -, z,+ }
  \\tkzTabLine{, -, z, h, t, + }
  \\tkzTabVar{+/$+\\infty$, -D+/$-2^5$/$\\frac{1}{3^n}$, R,-/$-\\infty$}
\\end{tikzpicture}`;
