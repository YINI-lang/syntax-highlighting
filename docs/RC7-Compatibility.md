# YINI RC.7 compatibility

The TextMate grammar and Notepad++ UDL definition target [YINI Specification 1.0.0-RC.7](https://github.com/YINI-lang/YINI-spec/blob/v1.0.0-rc.7/YINI-Specification.md), dated 2026-11-14. The reference is the `v1.0.0-rc.7` tag in the specification repository, commit `b812e3f151e609593c0bd87e957820ec30f9cabd`.

The review uses the specification's change list in section 16.4 and its [ANTLR lexer](https://github.com/YINI-lang/YINI-spec/blob/v1.0.0-rc.7/Grammar-ANTLR4/YiniLexer.g4) and [parser grammar](https://github.com/YINI-lang/YINI-spec/blob/v1.0.0-rc.7/Grammar-ANTLR4/YiniParser.g4). These grammars describe the language's syntax. Some validation rules are enforced by the parser implementation.

## TextMate and parser checks

The extension supplies TextMate labels, also called scopes, for coloring YINI text. It does not report parser warnings or errors in the editor. Automated tests use `yini-cli` and `yini-parser` 2.0.0 to check the examples and selected RC.7 rules.

| RC.7 rule or change | Where it is covered |
| --- | --- |
| Escaped strings use `E` or `e`, including triple quotes | Grammar, both comprehensive examples, scope tests, and parsed-value tests |
| Older `C`/`c` strings remain valid but are deprecated | Existing Classic scopes are retained; scope and parsed-value tests cover them |
| Lowercase `command"""` strings hold literal multiline text | Separate string scope, both comprehensive examples, delimiter tests, and parsed-value tests |
| Command-string indentation is removed from the value | Parser tests check indentation, extra spaces, and literal command-like content |
| Backticked names allow escaped backticks and backslashes, including empty names | Grammar, editor word selection, comprehensive examples, and tests |
| Backticked names reject raw control characters and unsupported escapes | Grammar excludes those forms; parser tests check C0, DEL, C1, and unsupported escapes |
| Escaped strings accept an escaped backtick; `\xhh` is a two-digit Unicode escape | Escape highlighting and parsed-value tests |
| `%` binary notation is deprecated but remains valid | Scope tests retain highlighting; separate diagnostic tests require a warning |
| Duplicate sections are errors in both modes | Parser tests in both modes |
| A mode declaration does not switch the active parser mode | Tests check rejection of strict-in-lenient and a warning for lenient-in-strict |
| Missing values become null with a warning in lenient mode and fail in strict mode | Dedicated warning fixture, parser tests, and CLI exit-code checks |
| Scalar concatenation uses normalized source spelling in lenient mode | Tests check decimals, exponents, base conversion, booleans, null, and negative zero |
| Root members sit beside top-level sections in lenient mode | Parsed-result test; strict-mode rejection is also checked |
| Source LF, CRLF, and CR become LF inside multiline string values | Parser tests cover raw, escaped, and command strings; escape results remain unchanged |
| Invalid key and section names cannot be silently remapped | Identifier patterns and parser tests for invalid names |
| Non-decimal integers share the signed 64-bit range | Signed number highlighting, exact integer tests, and overflow checks |
| Inline objects accept `=` in lenient mode; `:` is canonical and required in strict mode | The paired examples validate with the correct separators; compact object-key scope tests |
| EOF may end a complete final line | Tests parse root assignments and strict documents ending immediately after `/END` |
| Only spaces and tabs are horizontal syntax whitespace | Grammar rules use explicit space and tab patterns; Unicode separators are not treated as line endings |

The tests are focused checks for this extension and its fixtures. They are not a replacement for a parser's full conformance suite.

## Notepad++ coverage

[`notepadplusplus/YINI_byYINI-lang.xml`](../notepadplusplus/YINI_byYINI-lang.xml) supplies UDL styles for comments, disabled lines, raw and escaped strings, multiline strings, backticked names, literals, numbers, operators, and document keywords. It uses the same four public examples as the TextMate grammar. See the [Notepad++ build and installation guide](../notepadplusplus/README.md): the XML is maintained directly and is ready to import without compilation.

`npm run test:udl`, also included in `npm test`, checks well-formed XML, required UDL entries, keyword agreement with TextMate, delimiter priority and recovery settings, and separate disabled-line styling. These checks do not run the Notepad++ lexer. Parser tests establish YINI behavior; they do not establish either editor's rendering.

UDL does not provide TextMate scopes or context-sensitive key coloring. Its command strings close at any triple quote; an embedded triple quote can affect highlighting of subsequent lines. Semicolon comments and disabled-line delimiters are not restricted to the start of a line, and numbers and escapes receive approximate highlighting. See the [full UDL limitations](../notepadplusplus/README.md#differences-from-textmate-highlighting) and perform the editor checks in that guide before claiming support for a feature.

## Examples and warnings

The small samples and comprehensive examples are warning-free in their intended modes. The comprehensive pair keeps the same sections and member names in the same order. Strict mode uses one top-level section, string-only concatenation, no trailing commas, and a required `/END`.

Use `E`/`e` and `0b` in new documents. The older forms still receive highlighting. Intentional warning examples live in `tests/fixtures/rc7-warnings.yini`; the tests check their warnings rather than suppressing them.

Raw means that backslashes stay literal. It does not mean source line endings are preserved in parsed multiline values. Command strings produce ordinary text; YINI does not execute it.

## Comment colors

The repository's VS Code settings make YINI comments green and keep disabled lines separate. Installed copies respect the user's chosen theme. See the [color settings guide](VSCode.md) for optional settings and the [maintainer guide](Maintainer-Doc.md) for release checks.

The Notepad++ UDL uses green comment styles and a separate gray italic Delimiter 8 style for disabled lines. It inherits the editor background and font; token foreground colors can be adjusted in the UDL dialog for the chosen theme.
