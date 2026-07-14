# Changelog — Tkz-Tab Engine

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

This file is append-only: once an entry is added, it is not edited or removed. Corrections are recorded as new entries.

---

## [Unreleased]

### Fixed
- `2026-07-14` **#14** (Renderer,Low) Implement light/dark theming|
- `2026-07-14` **#15** (Renderer,In Progress) enclose the component into a isolation sheild|
- `2026-07-13` - **#08** (Packaging,High) `document.querySelectorAll` in measurement pass queries the whole page instead of the component's own subtree, Fixed by using a map of Ref, removed
- `2026-07-13` — **#06** *(Packaging, Medium)* — CSS Modules scoping caused the `.katex` override to silently no-op due to class-name hashing. Fixed via `:global(.katex)`.

---

## [0.1.0] — pre-publish

### Fixed
- **#05** *(Parser/Renderer, Medium)* — Added support for `R`, `R/`, and `R / ` syntax.
- **#04** *(Renderer, Medium)* — Fixed rendering of hatched areas and their labels.
- **#03** *(Renderer, High)* — Fixed rendering of "top" horizontal arrows (e.g. `+/` then `+/`).
- **#02** *(Parser, High)* — Fixed arrow shifting caused by double syntax (e.g. `+CD-`, `D+/`).
- **#01** *(Parser, Critical)* — Fixed crash from line-count mismatch between Init and content (e.g. #58, #61).
