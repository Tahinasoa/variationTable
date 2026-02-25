# Variation Table DSL (VT-DSL)

## 1. Overview

VT-DSL is a domain-specific language for describing variation and sign tables.

It is designed to be:

- Human-readable
- AI-friendly for generation and parsing
- Highly permissive (incomplete, incorrect, or non-standard tables are valid)
- Renderer-agnostic
- Structurally regular while semantically flexible

The DSL describes **table structure**, not mathematical correctness.

---

## 2. File Structure

A file consists of:

```
header <var>? : <domain-values>?

row <row-label>? <height>? : <row-content>?
row <row-label>? <height>? : <row-content>?
...
```

All components except the keyword itself and `:` are **optional**.
A file must contain exactly one header

Order:

1. `header`
2. zero or more `row`

---

## 3. Header Declaration

```
header <var>? : <value1>, <value2>, ..., <valueN>
```

### Semantics

- `header` defines:

  - the table variable (optional)
  - the domain values (optional)

- The number of domain values determines the **reference column count**
- Missing parts are allowed and preserved as such

### Syntax Rules

- `<var>` must be a quoted string if present
- Domain values must be quoted strings
- Commas separate domain values

### Examples

```text
header "$x$" : "$-\infty$", "$0$", "$+\infty$"
```

```text
header : "$0$", "$1$", "$2$"
```

```text
header "$t$" :
```

```text
header :
```

---

## 4. Row Declaration

```
row <row-label>? <height>? : <row-content>?
```

### Semantics

- A row describes **one horizontal line** of the table
- All components are optional, keyword and colon are required.
- Missing components are interpreted as unspecified, not invalid

### Components

#### Row Label

- Optional
- Must be a quoted string if present

#### Height

- Optional
- `/` followed by a positive number
  - **ex :** `row 'signe of $x$'/1.3 : `
- Used as a relative height multiplier
- No semantic meaning beyond layout

#### Row Content

- Optional
- A sequence of **tokens**
- Tokens may appear in any order and any quantity

### Examples

```text
row "sign of f'" / 1.2 : INC DEC
```

```text
row : INC DEC
```

```text
row "variation" :
```

```text
row :
```

---

## 5. Row Content Model (Core Concept)

### Fundamental Rule

A row content is a **linear sequence of tokens**.

Tokens may be:

- separators
- content elements (text or commands)

There is **no enforced alternation**.

---

### Implicit Completion Rule (Normative)

If a row content omits separators, they are **implicitly assumed to be empty separators (`&`)**.

Example:

```text
INC DEC CONST
```

is **semantically equivalent to**:

```text
& INC & DEC & CONST &
```

This rule applies everywhere and is fundamental to the DSL.

---

## 6. Separators

### Syntax

All separators contain the `&` symbol.

- `&` : none
- `|&` : single bar
- `||&` : double bar
- `:&` : dashed
- `::&` : double dashed

### Semantics

- Separators represent vertical boundaries between columns
- They may appear anywhere in a row content
- Their absence does not invalidate structure

---

## 7. Separator Labels

Labels may be attached immediately after a separator.

```
separator{position: value, ...}
```

### Position Identifiers

- `top-left`, `top-center`, `top-right`
- `center-left`, `center-center`, `center-right`
- `bottom-left`, `bottom-center`, `bottom-right`

### Rules

- Positions are identifiers (not strings)
- Values must be quoted strings
- Multiple labels per separator are allowed

### Examples

```text
:&{top-center:"$x_0$", bottom-right:"$y_0$"}
```

```text
|&{bottom-left:"$-2$", bottom-right:"$2$"}
```

---

## 8. Content Tokens

Content tokens describe what appears **inside columns**.

### 8.1 Text Content

- Must be single- or double-quoted
- May contain LaTeX or arbitrary text

Examples:

```text
"+"
"$f(x) > 0$"
"student forgot this"
```

---

### 8.2 Variation Commands

#### Commands

```
INC{...}
DEC{...}
CONST{...}
```

Commands are **unquoted** identifiers.

---

### Options Syntax

```
COMMAND{key:value, key:value, ...}
```

- Options are optional
- Unknown options are allowed and preserved
- Order is irrelevant

---

#### Common Options

| Option    | Meaning                        |
| --------- | ------------------------------ |
| `arrow`   | `start`, `end`, `both`, `none` |
| `colSpan` | positive number                |

Defaults:

- `arrow: end`
- `colSpan: 1`

---

#### CONST-specific Options

| Option | Meaning                   |
| ------ | ------------------------- |
| `vPos` | `top`, `center`, `bottom` |

Default:

- If omitted, deduced from context or assumed `center`

---

### Examples

```text
INC
```

```text
DEC{arrow:none}
```

```text
INC{arrow:start,colSpan:2}
```

```text
CONST{vPos:bottom}
```

---

## 9. Quoting Rules (Normative)

Quoted strings are required for:

- variable names
- domain values
- row labels
- text cell content
- separator label values

Unquoted identifiers are reserved for:

- keywords (`header`, `row`)
- commands (`INC`, `DEC`, `CONST`)
- option keys
- numeric literals ( numbers)

---

## 10. Whitespace & Newlines

- Whitespace is insignificant outside quoted strings
- Newlines have no semantic meaning
- Expressions may span multiple lines freely
- Formatting choices do not affect meaning

---

## 11. Error / Annotation Use Cases

The DSL intentionally supports incorrect, incomplete, or ambiguous input.

Examples:

```text
row : "???" INC "forgot sign"
```

```text
row : INC INC INC
```

```text
row : "&" "&" "&"
```

A quoted "&" is text, not a separator.

Such inputs are valid and represent the author’s intent, not correctness.

---

## 12. Minimal Example

```text
header "$x$" : "$-\infty$", "$0$", "$+\infty$"

row "sign of f'"/1 :
  "+" "-" "+"

row "variation of f"/2 :
  |& INC :& DEC & CONST{vPos:bottom}
```

---

## 13. Design Guarantees

- No implicit mathematical validation
- Flat, linear structure
- Lossless parsing
- Predictable for AI generation
- Suitable for educational annotation and rendering
