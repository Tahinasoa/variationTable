# VT-DSL

1. [Overview](#1-overview)
2. [General Syntax](#2-general-syntax)
3. [Separators](#3-separators)
4. [Undefined and Skipped Regions](#4-undefined-and-skipped-regions)
5. [Variations](#5-variations)
6. [Multicolumn Content](#6-multicolumn-content)

---

## 1. Overview

VT-DSL is a domain-specific language for describing variation and sign tables. It is designed to be:

- **Human-readable**
- **AI-friendly** for generation and parsing
- **Structurally regular** while semantically flexible

The DSL describes **table structure**, not mathematical correctness.

## 2. General Syntax
```vtdsl
header [var] : [domain]
row [row-label] [/height] : [row-content]
...
```

A file must contain exactly one `header`, followed by zero or more `row` declarations. All bracketed components are optional.

**`header`** — defines the first row; must come before any `row`.

- **`var`**: Defines the variable name.
- **`domain`**: Defines the boundaries and values, separated by commas (`,`).

Values can be **text** (delimited by `'` or `"`) or **math** (delimited by `$`). You can nest math inside text quotes: `"variation of $\abs{x}$"`.
```vtdsl
header $x$ : $-\infty$, $0$, $+\infty$
```

<button class="try-it" data-example-id="2.1">try it</button>

**`row`** — defines a horizontal row.

- **`row-label`**: label of the row, placed at the first column, e.g., `"sign of $f'(x)$"`.
- **`/height`**: Relative height multiplier, e.g., `/2`.
- **`row-content`**: Sequence of cell contents (text, math,signs, ...) and separators.

Signs `+` and `-` are **native tokens** and do not require quotes.
```vtdsl
row "sign of $f'(x)$" /1.5 : + -
```

<button class="try-it" data-example-id="2.2">try it</button>

## 3. Separators

Separators describe vertical lines between cells. They are optional.

| Syntax | Meaning             |
| ------ | ------------------- |
| `&`    | Invisible separator |
| `|&`  | single bar          |
| `||&`  |double bar           |
| `:&`   | Dashed              |
| `::&`  | Double dashed       |
```vtdsl
row  : ::& + :& - |&
row  : -& + & - ||&
```
<button class="try-it" data-example-id="3.1">try it</button>
Labels can be attached to a separator using `&{position:value}`. There are 9 positions:

| `top-left`    | `top-center` (alias `top`)       | `top-right`    |
| ------------- | -------------------------------- | -------------- |
| `center-left` | `center-center` (alias `center`) | `center-right` |
| `bottom-left` | `bottom-center` (alias `bottom`) | `bottom-right` |
```vtdsl
row : + |&{top-left:"top-left", bottom-right:"bottom-right"} -
row : + |&{center:$0$} -
```
<button class="try-it" data-example-id="3.2">try it</button>

## 4. Undefined and Skipped Regions

- **`UNDEF`**: Renders a hashed region where a function is not defined.
- **`SKIP`**: Skips a cell entirely; nothing is drawn, and the next content moves to the next cell.
```vtdsl
row : + UNDEF +
row : UNDEF SKIP UNDEF
```
<button class="try-it" data-example-id="4.1">try it</button>

## 5. Variations

Three commands describe function variation:

| Command | Meaning               |
| ------- | --------------------- |
| `INC`   | Increasing arrow      |
| `DEC`   | Decreasing arrow      |
| `CONST` | Constant (horizontal) |
```vtdsl
row : INC CONST DEC
```
<button class="try-it" data-example-id="5.1">try it</button>
**Options:**

- **`arrow`**: Set head to `"start"`, `"end"`, `"both"`, or `"none"`.
- **`vPos`**: (For `CONST`) Set to `"top"`, `"center"`, or `"bottom"`.
```vtdsl
row : INC{arrow:"start"} CONST{arrow:"none", vPos:"bottom"} DEC{arrow:"both"}
```
<button class="try-it" data-example-id="5.2">try it</button>

**Extrema and Limits:**  we can specify extrema and limits by attaching them to a separator
```vtdsl
row : &{bottom-right:$-\infty$} INC |&{top:$-1$} DEC &{bottom-left:$-\infty$}
```
<button class="try-it" data-example-id="5.3">try it</button>

**Note** : Labels on boundary separators must be explicitly aligned inward: use right-aligned positions at the left edge and left-aligned positions at the right edge.

## 6. Multicolumn Content

Any content type can span multiple columns using the `colSpan` option. If multiple options are used, separate them with a comma.
```vtdsl
row : "text"{colSpan:2} INC
row : UNDEF{colSpan:3}
row : DEC{arrow:"none", colSpan:2} CONST
```

<button class="try-it" data-example-id="6.1">try it</button>
