# YINI highlighting for Notepad++

[`YINI_byYINI-lang.xml`](YINI_byYINI-lang.xml) is a User Defined Language (UDL) definition for Notepad++. It targets YINI Specification 1.0.0-RC.7 and is maintained alongside the [VS Code TextMate grammar](../syntaxes/yini.tmLanguage.json) in this repository. Both use the same [small samples](../sample.yini) and [comprehensive examples](../comprehensive-example.yini).

The XML is ready to import. You do not need Node.js, a compiler, a plugin, or the VS Code extension to use it. Highlighting does not validate YINI, change parser modes, or execute command strings.

The filename combines the language name and maintainer identifier to follow the [Notepad++ UDL collection's submission rules](https://github.com/notepad-plus-plus/userDefinedLanguages/blob/master/CONTRIBUTING.md). The language still appears as **YINI** in Notepad++.

## Install by importing

1. Open [`YINI_byYINI-lang.xml`](YINI_byYINI-lang.xml) on GitHub and use **Download raw file** to save it as `YINI_byYINI-lang.xml`. If you cloned this repository, use the local `notepadplusplus/YINI_byYINI-lang.xml`. Do not save the GitHub HTML page containing the file.
2. In Notepad++, choose **Language > User Defined Language > Define your language...**. Menu wording can vary slightly between versions.
3. Click **Import...**, select `YINI_byYINI-lang.xml`, and close the dialog.
4. Exit and restart Notepad++.
5. Open a `.yini` file. If highlighting is not selected automatically, choose **Language > YINI**.

The definition registers the `yini` extension, including files such as `settings.strict.yini`. Check the **Ext.** box in the UDL dialog if another definition has claimed the extension. It should contain `yini`, without a leading dot.

## Alternative: install as a separate file

Use either this method or the import method, so that only one definition named **YINI** is installed.

1. Find your active Notepad++ configuration directory. Ordinary installations normally use `%AppData%\Notepad++`; portable installations use the directory containing `notepad++.exe`. Cloud configuration and `-settingsDir` can select another directory.
2. Exit Notepad++ before changing its configuration files.
3. Create the `userDefineLangs` subdirectory if needed, then copy `YINI_byYINI-lang.xml` into it.
4. Restart Notepad++ and open a `.yini` file, or choose **Language > YINI**.

See the [official UDL guide](https://npp-user-manual.org/docs/user-defined-language-system/) for configuration locations and import details.

## Update or remove

Before updating, export a backup if you have customized the YINI definition.

- If you imported the definition, select **YINI** in the UDL dialog and use **Remove**, then import the replacement XML and restart Notepad++.
- If you installed a separate file, exit Notepad++, replace `userDefineLangs/YINI_byYINI-lang.xml`, and restart. Delete that file while the editor is closed to uninstall it.

Do not repeatedly import the same definition or install it using both methods. Duplicate YINI entries can cause confusing language selection. Updating the XML can replace your custom colors.

## Supported features

| Feature | UDL highlighting |
| --- | --- |
| Comments | Green `//`, `#`, `;`, and `/* ... */` comments; shebang lines use the `#` comment style |
| Disabled lines | `--` through the end of the line uses a separate gray italic style |
| Raw strings | Unprefixed and `R`/`r` single, double, and triple quotes; backslashes remain literal |
| Escaped strings | `E`/`e` and deprecated `C`/`c` strings, with backslash escaping of delimiters |
| Multiline strings | Triple quotes, including `command"""`; comment-like content stays string-colored until the UDL closing delimiter |
| Backticked names | A separate name style with backslash-escaped delimiters |
| Literals | Case-insensitive `true`, `false`, `yes`, `no`, `on`, `off`, and `null` |
| Numbers | Decimal and scientific forms plus `hex:`, `0x`, `0b`, `%`, `0o`, and `0z` prefixes, subject to the limits below |
| Structure | `=`, `:`, `+`, commas, brackets, braces, and section-marker characters |
| Document markers | `@yini`, `strict`, `lenient`, and `/END` keywords |

## Differences from TextMate highlighting

UDL 2.1 has eight delimiter groups and uses literal matching. It cannot express all of the TextMate grammar's context and boundary rules. The differences affect highlighting only; they do not change valid YINI syntax.

- `;` and `--` are recognized anywhere outside strings, names, and block comments. YINI only permits their comment/disabled-line meanings after optional indentation at the start of a line.
- Command strings share the raw triple-quote style. UDL closes them at any `"""`, whereas YINI requires a closing delimiter on its own line. An embedded triple quote can end the UDL string early; the real closing delimiter can then start another string and color subsequent assignments incorrectly. UDL also matches other capitalizations of `command` and accepts text after the opening quotes on the same line; YINI requires lowercase `command` and a line ending immediately after the opener.
- Ordinary keys and section names keep the default text color. A key named `true` or `null` can receive the literal color, and document keywords are not restricted to document-marker positions. Section-marker styling does not validate nesting levels or numeric depths.
- Escapes are not individually colored or validated. Backslash escaping is more permissive than YINI's rules, including inside backticked names. Unfinished single-line strings and names normally recover at a line ending; a trailing escape can affect that recovery.
- Numeric styling is approximate. UDL shares extra digit characters between numeric prefixes and cannot enforce each base's digits, underscore placement, or integer range. Decimal numbers containing underscores, such as `1_000`, keep the default color in Notepad++ 8.4.7; other valid forms may receive partial styling.
- Non-ASCII operators such as `§` depend on Notepad++'s UDL encoding support. In the tested UTF-8 documents on Notepad++ 8.4.7, `§` keeps the default color; `^`, `<`, and `>` receive operator styling.
- Folding of YINI section hierarchies is not provided.

See the [RC.7 compatibility notes](../docs/RC7-Compatibility.md) for the distinction between editor highlighting and parser checks.

## Colors

Open the UDL dialog, select **YINI**, and use the **Styler** buttons to change colors. Comments use **Comment style** and **Comment line style**. Disabled lines use **Delimiter 8**, separately from comments.

The definition inherits the editor's default foreground for ordinary text, and its background and font for all styles. Token foreground colors are supplied by the UDL; changing the Notepad++ theme does not automatically replace those colors. Adjust them for your light, dark, or high-contrast theme as needed. No global theme settings are changed. VS Code settings are described in the [separate VS Code guide](../docs/VSCode.md).

## Develop and build

Edit `notepadplusplus/YINI_byYINI-lang.xml` directly. It is the distribution artifact; there is no generated XML or separate compilation step. Use the TextMate grammar and the shared examples to review syntax changes, then update both editor definitions or document an intentional UDL limitation.

From the repository root, install the pinned development dependencies and validate both implementations:

```shell
npm ci
npm test
```

For the XML checks alone:

```shell
npm run test:udl
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. The XML checks run in CI and check well-formedness, UDL structure, delimiter configuration, literal agreement with TextMate, and separate disabled-line styling. They do not run Notepad++ or prove rendered highlighting.

`npm run package:check` and `npm run package` check and build the **VS Code VSIX**. The Notepad++ directory is excluded from that package. Distribute `notepadplusplus/YINI_byYINI-lang.xml` directly for Notepad++.

## Check in Notepad++

After importing into a test configuration, open all four public examples: [`sample.yini`](../sample.yini), [`sample.strict.yini`](../sample.strict.yini), [`comprehensive-example.yini`](../comprehensive-example.yini), and [`comprehensive-example.strict.yini`](../comprehensive-example.strict.yini). Check the features in the table above, extension detection including `.YINI`, and readability in light and dark themes.

Use [`tests/fixtures/notepadplusplus-boundaries.yini`](../tests/fixtures/notepadplusplus-boundaries.yini) to check recovery after unfinished strings and names, raw versus escaped quotes, and the known command-string boundary limitation. This fixture includes invalid input and is not a public example to validate with the CLI.

Record the Notepad++ version and checks performed when reviewing changes. See the [maintainer guide](../docs/Maintainer-Doc.md) for an isolated configuration and release checks, or [SUPPORT.md](../SUPPORT.md) to report a problem.
