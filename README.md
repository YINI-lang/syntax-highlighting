# YINI Syntax Highlighting

[![Install from the VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Install-007ACC)](https://marketplace.visualstudio.com/items?itemName=yini-lang.yini-syntax-highlighting)
[![CI status](https://github.com/YINI-lang/yini-syntax-highlighting/actions/workflows/ci.yml/badge.svg)](https://github.com/YINI-lang/yini-syntax-highlighting/actions/workflows/ci.yml)

**Syntax highlighting** for [YINI](https://github.com/YINI-lang) configuration files in **VS Code, Notepad++, and other editors that support TextMate grammars**. Both definitions share this repository, examples, and issue tracker.

Compatibility: Both editor definitions target the [YINI Specification 1.0.0-RC.7](https://github.com/YINI-lang/YINI-spec/blob/v1.0.0-rc.7/YINI-Specification.md), dated 2026-11-14. See the [compatibility notes](docs/RC7-Compatibility.md) for the coverage and differences between editors.

The TextMate grammar highlights raw strings, escaped strings using `E` or `e`, multiline `command"""` strings, and backticked names with escaped backticks or backslashes. Older `C`/`c` strings and `%` binary numbers still receive highlighting, although the specification recommends newer forms. The Notepad++ definition covers these features with [UDL limitations](notepadplusplus/README.md#differences-from-textmate-highlighting), including approximate command-string boundaries and numeric styling.

Syntax highlighting assigns styles to text. It does not validate a document, select a parser mode, or run command strings. A `.strict.yini` filename or `@yini strict` marker describes the intended mode; the parser or tool must still be set to strict mode.

## Usage

### VS Code

1. Install [YINI Syntax Highlighting from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yini-lang.yini-syntax-highlighting) and open a file ending in `.yini` (case-insensitive).
2. Confirm that the language mode in the lower-right corner says **YINI**.

Other TextMate-compatible editors can register [`syntaxes/yini.tmLanguage.json`](syntaxes/yini.tmLanguage.json) using that editor’s grammar-registration mechanism. Configure the grammar’s `source.yini` scope and associate it with YINI files.

### Notepad++

Open [`notepadplusplus/YINI_byYINI-lang.xml`](notepadplusplus/YINI_byYINI-lang.xml) on GitHub and use **Download raw file**, then use **Language > User Defined Language > Define your language... > Import...** in Notepad++. Restart Notepad++ and open a `.yini` file, or choose **Language > YINI**. A local clone already contains the XML.

The XML is ready to import; no build, Node.js installation, or plugin is required. See the [Notepad++ guide](notepadplusplus/README.md) for installation, updates, supported features, colors, and development checks.

## Development

Press `F5` in VS Code to open an Extension Development Host. The [lenient example](comprehensive-example.yini) and [strict example](comprehensive-example.strict.yini) demonstrate the same features in the same order.

For Notepad++, edit `notepadplusplus/YINI_byYINI-lang.xml` directly and import it into a test configuration. There is no compilation step. Use the same four public examples for both editors; update both definitions together when the specification changes.

Run the automated TextMate grammar, scope, UDL XML, fixture, and parser tests with:

```shell
npm ci
npm test
```

Development requires Node.js 22.9 or newer. CI uses Node.js 24. The tests use pinned releases of `yini-cli` and `yini-parser` 2.0.0. Run `npm run test:udl` for XML checks alone. See the [maintainer guide](docs/Maintainer-Doc.md) for checking both editors, building the VS Code VSIX, and testing local installations. Notepad++ users install the XML directly.

## Customization

Comments appear green when this repository is opened in VS Code. Lines beginning with `--` keep their separate disabled-line style. Installing the extension elsewhere uses the user's chosen theme.

See [comment colors and disabled-line appearance](docs/VSCode.md) for optional settings that affect only YINI files, including greens for light and high-contrast themes.

Notepad++ uses UDL styles with green comments and separate gray italic disabled lines. See [Notepad++ colors](notepadplusplus/README.md#colors) to adjust them for your theme.

## Contributing

Pull requests, bug reports, and improvements are welcome!

Marketplace publisher: **YINI-lang** (`yini-lang`). Contributors and coding agents should also read [AGENTS.md](AGENTS.md).

## License

MIT License

---

**^YINI ≡**  
> YINI is a human-readable configuration format designed for clarity, readability, explicit structure, predictability, and deterministic parsing.

[yini-lang.org](https://yini-lang.org/?utm_source=github&utm_campaign=yini_syntax_hl&utm_medium=referral&utm_content=readme_footer) · [YINI on GitHub](https://github.com/YINI-lang)  
