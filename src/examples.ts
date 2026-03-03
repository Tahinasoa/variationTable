export let examples: Record<string, string> = {};

examples['default'] = `header $x$ : $-\\infty$ , $-1$, $+1$, $+\\infty$
row "sign of $f(x)$": + |&{center:$0$} - |&{center:$0$} -
row "Variations de $\\sqrt{x^2-1}$"/2: &{top-right:$+\\infty$} DEC &{bottom-left:$-\\infty$} UNDEF &{bottom-right:$+\\infty$}INC &{top-left:$+\\infty$}
row $g'(x)$/2 : &{bottom-right:$-5$} INC |&{top:$-2$} CONST |&{top-left :$-2$, bottom-right:$-\\infty$}INC &{top-left:$-1$}`;

examples["2.1"] = 
`header $x$ : $-\\infty$, $0$, $+\\infty$`

examples["2.2"] = 
`header $x$ : $-\\infty$, $0$, $+\\infty$
row "sign of $f'(x)$" /1.5 : + -`

examples["3.1"] = 
`header : $-1$,$0$, $+1$
row  : |& + ::& - |&
row  : ||& - |& + ||&`


examples["3.2"] = 
`header : $-1$,$0$, $+1$
row : + |&{top-left:"top-left", bottom-right:"bottom-right"} -
row : + |&{center:$0$} -`

examples["4.1"] = 
`header : $-\\infty$,$-1$, $+1$,$+\\infty$
row : + UNDEF +
row : UNDEF SKIP UNDEF`
examples["5.1"] = 
`header : $-\\infty$,$-1$, $+1$,$+\\infty$
row : INC CONST DEC`

examples["5.2"] = 
`header : $-\\infty$,$-1$, $+1$,$+\\infty$
row : INC{arrow:"start"} CONST{arrow:"none", vPos:"bottom"} DEC{arrow:"both"}`
examples["5.3"] = 
`header : $-\\infty$,$0$,$+\\infty$
row/2 : &{bottom-right:$-\\infty$} INC |&{top:$-1$} DEC &{bottom-left:$-\\infty$}`
examples["5.4"] = 
`header : $-\\infty$,$-1$,$+1$, $+\\infty$
row : "text"{colSpan:2} INC
      row : UNDEF{colSpan:3}
      row : DEC{arrow:"none", colSpan:2} CONST`
