// =========================
// Entry point
/*
header "$x$" : "$-\infty$","$-1$", "$+1$", "$+\infty$"
row "signe de $f'$" : "$+$" "$-$" "$+$"
row "variations de $f$" : INC &{top-center:"$\frac{1/3}$"} DEC |& INC
*/
// =========================
File
  = _ header:Header rows:Row* _ {
      return {
        type: "File",
        header,
        rows
      };
    }

// =========================
// Header
// =========================
Header
  = "header" _ varName:QuotedString? _ ":" _ domains:DomainValues? _ {
      return {
        type: "Header",
        variable: varName,
        domains
      };
    }

DomainValues
  = domains:QuotedString|.., _","_| {
      return domains;
    }

// =========================
// Rows
// =========================
Row
  = "row" _ label:QuotedString? _ heightMultiplier:Height? _ ":" contents:RowContent* {
  let formattedContent = [] ;
  contents.forEach(e=>{
  formattedContent.push(...e) ; 
  })
      return {
        type: "Row",
        label,
        heightMultiplier,
        contents : formattedContent
      };
    }

Height
  = "/" _ value:Number {
      return parseFloat(value);
    }

// =========================
// Row content
// =========================

RowContent
  = _ sep:Separator? _ cont:CellContent _ {
  		if(sep) return [sep,cont];
        return [cont]
    }
  / _ sep:Separator _ cont:CellContent? _ {
      if(cont) return [sep,cont];
      return [sep]
    }

// =========================
// Separators
// =========================
Separator
  = value:SeparatorCore options:KeyValueObject? {
      return {
        type: "Separator",
        value,
        options
      };
    }

SeparatorCore
  = "||&" { return "double"; }
  / "::&" { return "double-dashed"; }
  / "|&" { return "single"; }
  / ":&" { return "dashed"; }
  / "&" { return "none"; }

CellContent
  = Text
  / Command

Text
  = value:QuotedString _ options:KeyValueObject? {
      return { type: "Text", value,options };
    }

Command
  = value:CommandType _ options:KeyValueObject? {
      return {
        type: "Command",
        value,
        options
      };
    }

CommandType
  = "INC" { return "INC"; }
  / "DEC" { return "DEC"; }
  / "CONST" { return "CONST"; }

KeyValueObject
  = _ "{" opt:KeyValuePair|.., _","_| "}" {
      //merge key-value pairs
      const flattened = Object.values(opt).reduce((acc, current) => {
        return { ...acc, ...current };
      }, {});
      return flattened;
    }

KeyValuePair
  = key:Identifier _ ":" _ value:(QuotedString / Number) {
      return { [key]: value };
    }

// =========================
// Lexical rules
// =========================
QuotedString
  = "\"" chars:DoubleStringChar* "\"" { return chars.join(""); }
  / "'" chars:SingleStringChar* "'" { return chars.join(""); }

DoubleStringChar
  = !'"' c:. { return c; }

SingleStringChar
  = !"'" c:. { return c; }

Identifier
  = $([a-zA-Z_][a-zA-Z0-9_-]*)

Number
  = $([0-9]+ ("." [0-9]+)?)

_ = [ \t\r\n]*   // insignificant whitespace