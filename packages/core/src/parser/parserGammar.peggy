{
  function makeLatex(val) {
    return { type: "LatexExpression", value: val?val.trim():"" };
  }
  function makeLatexOrNull(val) {
    return val.trim() === "" ? null : makeLatex(val);
  }
}

TkzTabDocument
  = _ ("$$" _)? "\\begin{tikzpicture}" _ body:TkzTabCommand* _ "\\end{tikzpicture}" _ ("$$" _)?
    { return { type: "TkzTabDocument", body }; }
  / _ body:TkzTabCommand* _
    { return { type: "TkzTabDocument", body }; }

TkzTabCommand "valid 'tkz-tab' commands"
  = TkzTabShortcut
  / TkzTabLine
  / TkzTabInit
  / TkzTabVar
  / TkzTabVal
  / TkzTabIma
  / TkzTabSlope

TkzTabShortcut "'tkzTab' shortcut command"
  = "\\" "tkzTab" ![a-zA-Z] _ OptionalOptions? _ "{" _ rows:InitRows _ "}" _ "{" _ antecedents:AntecedentList _ "}" _ "{" _ signs:LineElementList _ "}" _ "{" _ variations:VarElementList _ "}" _
    {
      const loc = location() ;
      return { type: "tkzTabShortcut", rows, antecedents, signs, variations,line:loc.start.line,column:loc.start.column }; }

TkzTabInit "'tkzTabInit' command"
  = "\\" "tkzTabInit" _ OptionalOptions? _ "{" _ rows:InitRows _ "}" _ "{" _ antecedents:AntecedentList _ "}" _
    {
      const loc = location() ;
      return { type: "tkzTabInit", rows, antecedents,line:loc.start.line,column:loc.start.column }; }

TkzTabLine "'tkzTabLine' command"
  = "\\" "tkzTabLine" _ OptionalOptions? _ "{" _ elements:LineElementList _ "}" _
    {
      const loc = location() ;
      return { type: "tkzTabLine", elements,line:loc.start.line,column:loc.start.column }; }

TkzTabVar "'tkzTabVar' command"
  = "\\" "tkzTabVar" _ OptionalOptions? _ "{" _ elements:VarElementList _ "}" _
    { 
      const loc = location() ;
      return { type: "tkzTabVar", elements,line:loc.start.line,column:loc.start.column }; }

TkzTabVal "'tkzTabVal' command"
  = "\\" "tkzTabVal" _ OptionalOptions? _ "{" _ start:Integer _ "}" _ "{" _ end:Integer _ "}" _ "{" _ pos:Decimal _ "}" _ "{" _ ant:LatexValueOrNull _ "}" _ "{" _ img:LatexValueOrNull _ "}" _
    {
      const loc = location() ;
      return { type: "tkzTabVal", startRank: start, endRank: end, position: pos, antecedent: ant, image: img ,line:loc.start.line,column:loc.start.column}; }

TkzTabIma "'tkzTabIma' command"
  = "\\" "tkzTabIma" _ OptionalOptions? _ "{" _ start:Integer _ "}" _ "{" _ end:Integer _ "}" _ "{" _ at:Integer _ "}" _ "{" _ img:LatexValueOrNull _ "}" _
    {
      const loc = location() ;
      return { type: "tkzTabIma", startRank: start, endRank: end, atRank: at, image: img,line:loc.start.line,column:loc.start.column }; }

TkzTabSlope "'tkzTabSlope' command"
  = "\\" "tkzTabSlope" _ "{" _ slopes:SlopeList _ "}" _
    {
      const loc = location() ;
      return { type: "tkzTabSlope", slopes,line:loc.start.line,column:loc.start.column }; }

// ---------------------------------------------------------------------------
// Listes
// ---------------------------------------------------------------------------

InitRows '"tkzTabInit" row list definition'
  = rows:InitRow|0.., _ "," _|
    { return rows; }

InitRow '"tkzTabInit" row definition'
  = label:InitLabel _ "/" _ h:Decimal
    { return { label: makeLatex(label), height: h }; }

InitLabel '"tkzTabInit" row label'
  = $(![,/}] @Expression)*

AntecedentList '"tkzTabInit" antecetend list'
  = vals:LatexValue|0.., _ "," _|
    { return vals.map(makeLatex); }

LineElementList '"tkzTabLine" arguments'
  = elems:LineElement|1.., _ "," _|
    { return elems; }

LineElement '"tkzTabLine" entry'
  = &[,}] { return { kind: "empty" }; }
  / kw:LineKeyword
    { return { kind: "keyword", value: kw }; }
  / val:LatexValue
    { return val.trim() === "" ? { kind: "empty" } : { kind: "content", value: makeLatex(val) }; }

LineKeyword '"tkzTabLine" keyword'
  = kw:$("z" / "d" / "t" / "h" / "+" / "-") &(_ [,}\n\r\t ])
    { return kw; }

VarElementList '"tkzTabVar" arguments'
  = elems:VarElement|1.., _ "," _|
    { return elems; }

VarElement '"tkzTabVar" entry'
  = "R" _ left:("/" _ @VarValue)? _ right:("/" _ @VarValue)?{ return {modifier: "R" }; }
  / mod:VarModifier _ left:("/" _ @VarValue)? _ right:("/" _ @VarValue)?
    { return { modifier: mod, left: makeLatex(left), right: makeLatex(right) }; }


VarModifier '"tkzTabVar" modifier'
  = $([+\-CDHVcdhv]+)

VarValue '"tkzTabVar" value'= $(![,/}] @Expression)*

SlopeList '"tkzTabSlope" argument list'
  = slopes:SlopeEntry|1.., _ "," _|
    { return slopes; }


SlopeValue '"tkzTabSlope" value'= $(![,/}] @Expression)*

SlopeEntry '"tkzTabSlope" entry'
  = rank:Integer _ "/" _ left:SlopeValue _ "/" _ right:SlopeValue
    { 
      return {
        atRank: rank, 
        leftValue: left.trim() === "" ? null : makeLatex(left),
        rightValue: right.trim() === "" ? null : makeLatex(right)
      }; 
    }
// ---------------------------------------------------------------------------
// Expressions LaTeX
// ---------------------------------------------------------------------------

LatexValue   "Latex expression"    = $(![,] @Expression)*
LatexValueOrNull "Latex expression or empty slot"= val:LatexValue { return makeLatexOrNull(val); }

Expression  "Latex expression" = BracedUnit / Unit
BracedUnit "Braced expression"  = "{" $Expression* "}"
Unit     "Simple expression"    = $(LineBreak / EscapedBrace / ![{}] .)
EscapedBrace "Opening/closing Brace" = $("\\{" / "\\}")
LineBreak  "Line break"  = "\\\\"

// ---------------------------------------------------------------------------
// Options entre crochets (ignorées)
// ---------------------------------------------------------------------------

OptionalOptions "Optional Options"= "[" (!"]" .)* "]"

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

Integer "Integer"
  = digits:[0-9]+
    { return parseInt(digits.join(""), 10); }

Decimal "Decimal number"
  = val:$([0-9]+ ("." [0-9]+)?  / "." [0-9]+ )
    { return parseFloat(val); }

_  'Whitespace'= [ \t\n\r]*
__ 'inline whitespace'= [ \t]*