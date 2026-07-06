# 🚀 VariationTable

`VariationTable` is a high-performance React component designed to render LaTeX `tkz-tab` variation and sign tables directly in the browser, with no server-side compilation required.

---

## 💡 Why this project?

The LaTeX `tkz-tab` package is the standard for creating complex mathematical tables, but its usage is typically confined to the LaTeX ecosystem.

On the web, there is no lightweight, native solution to display these tables. I developed `VariationTable` to:

* **Bridge the gap:** Enable educators and developers to render mathematical tables without the need for static image generation or heavy PDF exports.
* **Performance:** Achieve instant rendering through a dedicated parsing engine.

---

## ⚙️ Architecture & Functionality

The engine follows a three-stage pipeline:

1. **Parsing (Peggy.js):** The source `tkz-tab` code is parsed to generate an Abstract Syntax Tree (AST).
2. **Transformation:** An intermediate layer converts the AST into a structured data format tailored for React.
3. **Multi-layer Rendering:**
* **Math Layer:** Utilizes [KaTeX](https://katex.org/) for high-fidelity mathematical typography.
* **SVG Layer:** Handles the drawing of arrows, forbidden regions, and the table outline.
* *Note:* Arrows are rendered after measuring label dimensions to ensure precise, geometrically accurate positioning.



---

## 🛠 Integration Guide

### Installation

*Coming soon to npm.*

### Basic Usage

```tsx
import {VariationTable} from '@variation/core'

const MyComponent = () => {
  const latexCode = `\\begin{tikzpicture} ... \\end{tikzpicture}`;
  
  return <VariationTable inputText={latexCode} />;
};

```

*If a syntax or logic error is detected, the component automatically displays a descriptive error message instead of the table.*

---

## 📈 Roadmap

* [ ] Implement unit testing suite (Vitest).
* [ ] Improve error handling and user feedback.
* [ ] Add full support for `tkzTabIma`, `tkzTabVal`, and `TkzTabSlope` commands.
* [ ] Implement support for optional arguments.

---
