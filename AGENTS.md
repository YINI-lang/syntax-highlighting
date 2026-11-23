# AGENTS.md

> AI agent instructions for this repository.
>
> Read this before making any changes to the codebase.
>
> If any instruction in this file is unclear, ambiguous, or conflicts with the repository state, do not proceed with changes that depend on that instruction. Ask the human maintainer for clarification first.

---

## Repository guidance

Read the [README](README.md) for the project overview and compatibility target.

- Target YINI Specification 1.0.0-RC.7. Use [the compatibility notes](docs/RC7-Compatibility.md) when changing syntax rules or validation fixtures.
- Keep the Marketplace identity `yini-lang.yini-syntax-highlighting`.
- Maintain the TextMate grammar and `notepadplusplus/YINI_byYINI-lang.xml` together, using the same four public examples. Document UDL limitations rather than promising identical highlighting.
- The Notepad++ XML is maintained directly and needs no compilation. Follow the [Notepad++ build and installation guide](notepadplusplus/README.md) and [maintainer checks](docs/Maintainer-Doc.md) when changing it.
- Keep the lenient and strict comprehensive examples in the same feature order.
- Keep ordinary comments and `--` disabled/ignored lines distinct in both editors. TextMate disabled lines must retain their separate `meta.line.disabled.yini` scope. Notepad++ disabled lines must retain their separate Delimiter 8 style, without comment or string nesting.
- Run `npm test` after changing either editor definition, examples, or package metadata. `npm run test:udl` checks XML structure and configuration; actual Notepad++ highlighting needs a separate editor check.
- Keep the four public examples free of warnings. Put intentional warning cases in `tests/fixtures/` and check their expected diagnostics separately.
- Write documentation and example explanations in plain English.
- Keep green-comment settings limited to YINI comments. Preserve theme choice for extension users and the separate disabled-line appearance.
- Keep `notepadplusplus/**` excluded from the VSIX. Distribute the ready-to-import XML separately; do not change users' global editor settings.
