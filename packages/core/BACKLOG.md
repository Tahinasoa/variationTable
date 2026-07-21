# Backlog — Tkz-Tab Engine

Living list of open work: known issues, pending tasks, and planned improvements. Items are removed from here and added to `CHANGELOG.md` once resolved — never marked "done" in place.

---

## 🐞 Open Issues

**Status legend:** `Todo` — not started · `In Progress` — actively being worked on · `Blocked` — waiting on something external

| ID | Component | Severity | Status | Description |
|:---|:---|:---|:---|:---|
| #07 | Packaging | Low | Todo | SVG `id` collision — `<marker>`/`<pattern>` ids are global, not scoped by `<svg>` nesting; breaks with 2+ instances on one page |
| #09 | Packaging | Medium | Todo | Global side-effect import of `katex.min.css` — no scoping, potential duplication/version conflicts with host app |
| #10 | Packaging | Medium | Todo | CSS Modules must be pre-compiled before publishing — consumer's bundler can't be assumed to process `.module.css` |
| #14 | Architecture | High | In Progress | re-implement the architecture to make a clean separation between layout calculation and rendering.

*see: [`ARCHITECTURE.md : item 1`](./ARCHITECTURE.md)*

---

## 🚀 Features

| ID | Component | Status | Description |
|:---|:---|:---|:---|
| #12 | Parser | Todo | Improve  error message readability and context for invalid LaTeX syntax |
| #13 | Parser,Renderer | In Progress | Implement  full support for `\tkzTabVal` and \tkzTabIma commands |

## 🧪 Test Cases Pending

- [ ] Multi-instance rendering: 2+ `<VariationTable>` components on one page (validates #07, #08)
- [ ] Bare consumer project: package dropped into a fresh `create-vite`/CRA app with zero special config (validates #10)

---

## 📝 Planned Work (not yet triaged as formal issues)
- Parser: migrate to `Zod` for strict post-Peggy AST validation.
- Renderer: implement functional isolation via `ErrorBoundary` to prevent global crashes.

---

## 💡 Open Decisions

| Date | Decision |
|:---|:---|
| 2026-07-13 | Rejected Shadow DOM for SVG id isolation (#07) — adds architectural complexity, reduces host-page CSS theming ability. Going with `useId()`-based per-instance id suffixes instead. |
| 2026-07-13 | `katex` (#09) to be moved to `peerDependencies` rather than bundled, so consumers control their own KaTeX version. |
