## Task 1: Architectural Refactoring – Separation of Concerns

**Priority:** High | **Status:** In Progress

### Overview

Currently, the `TableData` model holds the raw data and exposes functions to calculate node positions. However, the heavy lifting—calculating final layout coordinates—is performed directly within the React components during the render cycle. This coupling makes the logic difficult to test and prone to performance issues.

**Current Pipeline:**

`inputText` --[parser]--> `AST` --[transform]--> `TableData` --[]-->`react components`.

### Proposed Architecture

I propose decoupling the layout logic from the UI. We will introduce a dedicated layout engine that transforms the `AST` into a `TableLayoutData` object. This object will contain all the necessary dimensions and positions before any component rendering occurs.

**Proposed Pipeline:**

`inputText` --[parser]--> `AST` --[calculateLayout] --> `TableLayoutData` ----> `React Components`

### Geometric Correction

Since certain elements have physical dimensions that are only measurable after DOM rendering, we will implement a two-pass feedback loop for geometric correction:

**Refined Pipeline:**
`inputText` --[parser]--> `AST` --[calculateLayout] --> `TableLayoutData` -----> `React Components`


*...with a feedback loop for...*

`React Components` <===[Geometric Correction]==> `TableLayoutData`

---
