# Repository guidance

Read the [README](README.md) for the project overview and compatibility target.

- Keep the Marketplace identity `yini-lang.yini-syntax-highlighting`.
- Keep the lenient and strict comprehensive examples in the same feature order.
- Keep ordinary comments and `--` disabled/ignored lines distinct in the syntax highlighting. Disabled lines must retain their separate `meta.line.disabled.yini` scope rather than being treated as comments.
- Run `npm test` after changing the grammar, examples, or package metadata.
