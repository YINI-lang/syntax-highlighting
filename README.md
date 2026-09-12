# YINI Syntax Highlighting

Syntax highlighting for [YINI](https://github.com/YINI-lang) configuration files in VS Code and other editors that support TextMate grammars.

Compatibility: This extension targets the [YINI Specification 1.0.0-RC.6](https://yini-lang.org/refs/specification/).

## Usage

1. Install [YINI Syntax Highlighting from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yini-lang.yini-syntax-highlighting) and open a file ending in `.yini`.
2. Confirm that the language mode in the lower-right corner says **YINI**.

Other TextMate-compatible editors can use [`syntaxes/yini.tmLanguage.json`](syntaxes/yini.tmLanguage.json) directly.

## Development

Press `F5` in VS Code to open an Extension Development Host. The [lenient example](comprehensive-example.yini) and [strict example](comprehensive-example.strict.yini) demonstrate the same features in the same order.

Run the automated grammar, scope, fixture, and parser tests with:

```shell
npm ci
npm test
```

See the [maintainer guide](docs/Maintainer-Doc.md) for scope inspection, packaging, and clean Marketplace installation instructions.

## Customization

- [Customizing disabled-line appearance in VS Code](docs/VSCode.md)
  
## Contributing

Pull requests, bug reports, and improvements are welcome!

Marketplace publisher: **YINI-lang** (`yini-lang`). Contributors and coding agents should also read [AGENTS.md](AGENTS.md).

## License

MIT License

---

**^YINI ≡**  
> YINI is a human-readable configuration format designed for clarity, readability, explicit structure, predictability, and deterministic parsing.

[yini-lang.org](https://yini-lang.org/?utm_source=github&utm_medium=referral&utm_campaign=yini_syntax_hl&utm_content=readme_footer) · [YINI on GitHub](https://github.com/YINI-lang)  
