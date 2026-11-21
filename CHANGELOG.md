# Changelog

All notable changes to the YINI syntax-highlighting extension are documented here.

## 1.1.0 - 2026-11-21

### Added

- Support for YINI Specification 1.0.0-RC.7, including `E`/`e` escaped strings and multiline `command"""` strings.
- Support for escaped backticks and backslashes in backticked names, empty backticked names, and escaped backticks in escaped strings.
- RC.7 tests for parsed values, expected warnings, strict-mode errors, and command-string boundaries.
- Green YINI comments in the repository's VS Code settings, with separate colors for light and high-contrast themes. Disabled lines keep their existing style.
- Plain-English instructions for comment colors and RC.7 compatibility.

### Fixed

- Compact object keys such as `{hex:10}` and keys named `true` or `null` now receive key highlighting.
- Signed numbers, leading-dot fractions, compact string concatenation, and comments between section markers and names receive the appropriate highlighting.
- The example-order check now ignores content inside multiline strings and comments.

### Changed

- Updated all four examples for RC.7. The comprehensive examples still show the same features in the same order.
- Pinned the validation tools to `yini-cli` and `yini-parser` 2.0.0. Warning examples are tested separately from the warning-free examples.
- Kept support for deprecated `C`/`c` strings and `%` binary literals, including existing Classic string scopes.

## 1.0.0 - 2026-09-13

### Added

- TextMate scope tests for comments, sections, strings, numbers, collections, and operators.
- Automated validation for the grammar, example files, fixture ordering, and package contents.
- Strict and lenient examples targeting YINI Specification 1.0.0-RC.6.

### Changed

- Updated the TextMate grammar for YINI Specification 1.0.0-RC.6.
- Pointed package links to `YINI-lang/syntax-highlighting`.
- Consolidated validation into one reproducible CI workflow with pinned npm dependencies.
