# YINI Syntax Highlighting

[![Install from the VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Install-007ACC)](https://marketplace.visualstudio.com/items?itemName=yini-lang.yini-syntax-highlighting)
[![CI status](https://github.com/YINI-lang/syntax-highlighting/actions/workflows/ci.yml/badge.svg)](https://github.com/YINI-lang/syntax-highlighting/actions/workflows/ci.yml)

Syntax highlighting for [YINI](https://github.com/YINI-lang) configuration files in VS Code and other editors that support TextMate grammars.

Compatibility: This extension targets the [YINI Specification 1.0.0-RC.7](https://github.com/YINI-lang/YINI-spec/blob/v1.0.0-rc.7/YINI-Specification.md), dated 2026-11-14. See the [compatibility notes](docs/RC7-Compatibility.md) for the rules covered by the tests.

The extension highlights raw strings, escaped strings using `E` or `e`, multiline `command"""` strings, and backticked names with escaped backticks or backslashes. Older `C`/`c` strings and `%` binary numbers still receive highlighting, although the specification recommends newer forms.

Syntax highlighting assigns styles to text. It does not validate a document, select a parser mode, or run command strings. A `.strict.yini` filename or `@yini strict` marker describes the intended mode; the parser or tool must still be set to strict mode.

## Usage

1. Install [YINI Syntax Highlighting from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yini-lang.yini-syntax-highlighting) and open a file ending in `.yini` (case-insensitive).
2. Confirm that the language mode in the lower-right corner says **YINI**.

Other TextMate-compatible editors can register [`syntaxes/yini.tmLanguage.json`](syntaxes/yini.tmLanguage.json) using that editor’s grammar-registration mechanism. Configure the grammar’s `source.yini` scope and associate it with YINI files.

## Development

Press `F5` in VS Code to open an Extension Development Host. The [lenient example](comprehensive-example.yini) and [strict example](comprehensive-example.strict.yini) demonstrate the same features in the same order.

Run the automated grammar, scope, fixture, and parser tests with:

```shell
npm ci
npm test
```

Development requires Node.js 22 or newer. The tests use pinned releases of `yini-cli` and `yini-parser` 2.0.0. See the [maintainer guide](docs/Maintainer-Doc.md) for checking highlighting, packaging, and testing a local installation.

## Customization

Comments appear green when this repository is opened in VS Code. Lines beginning with `--` keep their separate disabled-line style. Installing the extension elsewhere uses the user's chosen theme.

See [comment colors and disabled-line appearance](docs/VSCode.md) for optional settings that affect only YINI files, including greens for light and high-contrast themes.

## Contributing

Pull requests, bug reports, and improvements are welcome!

Marketplace publisher: **YINI-lang** (`yini-lang`). Contributors and coding agents should also read [AGENTS.md](AGENTS.md).

## License

MIT License

---

**^YINI ≡**  
> YINI is a human-readable configuration format designed for clarity, readability, explicit structure, predictability, and deterministic parsing.

[yini-lang.org](https://yini-lang.org/?utm_source=github&utm_campaign=yini_syntax_hl&utm_medium=referral&utm_content=readme_footer) · [YINI on GitHub](https://github.com/YINI-lang)  
