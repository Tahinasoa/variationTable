export let examples: Record<string, string> = {};

examples['default'] = `header $x$ : $-\\infty$ , $-1$, $+1$, $+\\infty$
row "sign of $f(x)$": + |&{center:$0$} - |&{center:$0$} -
row "Variations de $\\sqrt{x^2-1}$"/2: &{top-right:$+\\infty$} DEC &{bottom-left:$-\\infty$} UNDEF &{bottom-right:$+\\infty$}INC &{top-left:$+\\infty$}
row $g'(x)$/2 : &{bottom-right:$-5$} INC |&{top:$-2$} CONST |&{top-left :$-2$, bottom-right:$-\\infty$}INC &{top-left:$-1$}`;

examples['2.1'] = `header : $-\\infty$,$0$,$+\\infty$
row "signe de $f'$": + :& -
row "variation de $f(x)$": INC DEC`;

examples['3.1'] = `header $x$ : $-\\infty$,$0$,$+\\infty$
row "signe de $f'$": + -
row "variation de $f(x)$": INC &{top-center:"5", bottom-center:"4"}DEC `;

examples['3.2'] = `header : "", "" , "","" , "" 
row /2: INC CONST{arrow:"both"} DEC{arrow:"start"} INC{arrow:"end"}
row /2: INC{colSpan:2} DEC {colSpan:2}`;

examples['4.1'] =
  //row is skipped
  `header : "", "" , "", ""
row : INC |&  |& DEC`;

examples['4.2'] =
  //multiple label attached to a separator
  `header : "", "" , ""
row/2 : INC |&{top-center:$+1$, bottom-center:$-1$} INC`;

examples['4.3'] =
  //mixed content type
  `header : "", "" , "", ""
row/2 : INC |& "I don't know" |& DEC`;
