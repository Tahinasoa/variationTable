{
  function makeLatex(val) {
    return { type: "LatexExpression", value: val.trim() };
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

TkzTabCommand
  = TkzTabShortcut
  / TkzTabInit
  / TkzTabLine
  / TkzTabVar
  / TkzTabVal
  / TkzTabIma
  / TkzTabSlope

TkzTabShortcut
  = "\\" "tkzTab" ![a-zA-Z] _ OptionalOptions? _ "{" _ rows:InitRows _ "}" _ "{" _ antecedents:AntecedentList _ "}" _ "{" _ signs:LineElementList _ "}" _ "{" _ variations:VarElementList _ "}" _
    { return { type: "tkzTabShortcut", rows, antecedents, signs, variations }; }

TkzTabInit
  = "\\" "tkzTabInit" _ OptionalOptions? _ "{" _ rows:InitRows _ "}" _ "{" _ antecedents:AntecedentList _ "}" _
    { return { type: "tkzTabInit", rows, antecedents }; }

TkzTabLine
  = "\\" "tkzTabLine" _ OptionalOptions? _ "{" _ elements:LineElementList _ "}" _
    { return { type: "tkzTabLine", elements }; }

TkzTabVar
  = "\\" "tkzTabVar" _ OptionalOptions? _ "{" _ elements:VarElementList _ "}" _
    { return { type: "tkzTabVar", elements }; }

TkzTabVal
  = "\\" "tkzTabVal" _ OptionalOptions? _ "{" _ start:Integer _ "}" _ "{" _ end:Integer _ "}" _ "{" _ pos:Decimal _ "}" _ "{" _ ant:LatexValueOrNull _ "}" _ "{" _ img:LatexValueOrNull _ "}" _
    { return { type: "tkzTabVal", startRank: start, endRank: end, position: pos, antecedent: ant, image: img }; }

TkzTabIma
  = "\\" "tkzTabIma" _ OptionalOptions? _ "{" _ start:Integer _ "}" _ "{" _ end:Integer _ "}" _ "{" _ at:Integer _ "}" _ "{" _ img:LatexValueOrNull _ "}" _
    { return { type: "tkzTabIma", startRank: start, endRank: end, atRank: at, image: img }; }

TkzTabSlope
  = "\\" "tkzTabSlope" _ "{" _ slopes:SlopeList _ "}" _
    { return { type: "tkzTabSlope", slopes }; }

// ---------------------------------------------------------------------------
// Listes
// ---------------------------------------------------------------------------

InitRows
  = rows:InitRow|1.., _ "," _|
    { return rows; }

InitRow
  = label:InitLabel _ "/" _ h:Decimal
    { return { label: makeLatex(label), height: h }; }

InitLabel
  = $(!(__ "/" __ Decimal) ![,}] @Expression)*

AntecedentList
  = vals:LatexValue|1.., _ "," _|
    { return vals.map(makeLatex); }

LineElementList
  = elems:LineElement|1.., _ "," _|
    { return elems; }

LineElement
  = &[,}] { return { kind: "empty" }; }
  / kw:LineKeyword
    { return { kind: "keyword", value: kw }; }
  / val:LatexValue
    { return val.trim() === "" ? { kind: "empty" } : { kind: "content", value: makeLatex(val) }; }

LineKeyword
  = kw:$("z" / "d" / "t" / "h" / "+" / "-") &(_ [,}\n\r\t ])
    { return kw; }

VarElementList
  = elems:VarElement|1.., _ "," _|
    { return elems; }

VarElement
  = "R" _ "/"
    { return { kind: "skip", modifier: "R" }; }
  / mod:VarModifier _ "/" _ left:VarValue _ "/" _ right:VarValue
    { return { kind: "double", modifier: mod, left: makeLatex(left), right: makeLatex(right) }; }
  / mod:VarModifier _ "/" _ val:VarValue
    { return { kind: "single", modifier: mod, value: makeLatex(val) }; }

VarModifier
  = $([+\-CDHVcdhv]+)

VarValue = $(![,/}] @Expression)*

SlopeList
  = slopes:SlopeEntry|1.., _ "," _|
    { return slopes; }


SlopeValue = $(![,/}] @Expression)*

SlopeEntry
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

LatexValue       = $(![,] @Expression)*
LatexValueOrNull = val:LatexValue { return makeLatexOrNull(val); }

Expression   = BracedUnit / Unit
BracedUnit   = "{" $Expression* "}"
Unit         = $(LineBreak / EscapedBrace / ![{}] .)
EscapedBrace = $("\\{" / "\\}")
LineBreak    = "\\\\"

// ---------------------------------------------------------------------------
// Options entre crochets (ignorées)
// ---------------------------------------------------------------------------

OptionalOptions = "[" (!"]" .)* "]"

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

Integer
  = digits:[0-9]+
    { return parseInt(digits.join(""), 10); }

Decimal
  = val:$([0-9]+ ("." [0-9]+)?)
    { return parseFloat(val); }

_  = [ \t\n\r]*
__ = [ \t]*