# AGENTS.md

> AI agent instructions for this repository.
>
> Read this before making any changes to the codebase.
>
> If any instruction in this file is unclear, ambiguous, or conflicts with the repository state, do not proceed with changes that depend on that instruction. Ask the human maintainer for clarification first.

---

## Repository guidance

Read the [README](README.md) for the project overview and compatibility target.

- Keep the Marketplace identity `yini-lang.yini-syntax-highlighting`.
- Keep the lenient and strict comprehensive examples in the same feature order.
- Keep ordinary comments and `--` disabled/ignored lines distinct in the syntax highlighting. Disabled lines must retain their separate `meta.line.disabled.yini` scope rather than being treated as comments.
- Run `npm test` after changing the grammar, examples, or package metadata.
