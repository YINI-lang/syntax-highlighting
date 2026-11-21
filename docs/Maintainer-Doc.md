# Maintainer guide

The extension targets YINI Specification 1.0.0-RC.7. See the [compatibility notes](RC7-Compatibility.md) for the source version and test coverage.

## Run the automated checks

Use Node.js 22 or newer. CI uses Node.js 24. Install the exact development dependencies recorded in `package-lock.json`, then run the tests:

```shell
npm ci
npm test
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

The suite checks the grammar's regular expressions, token labels, example order, and parsing in both modes. It also checks RC.7 string values, expected warnings, and invalid inputs. The parser and CLI are both pinned to version 2.0.0.

The four public examples must pass without warnings. Intentional warning cases belong in `tests/fixtures/rc7-warnings.yini`. Their tests check the warnings and verify that the CLI fails when `--warnings-as-errors` is selected.

Individual checks are available:

```shell
npm run test:grammar
npm run test:scopes
npm run test:fixtures
npm run test:yini
npm run test:rc7
```

Files ending in `.test.yini` contain highlighting assertions. They are test inputs, not complete example documents to validate with the CLI.

## Check highlighting in VS Code

1. Open this repository's root folder in VS Code.
2. Press `F5`, or choose **Run Extension** in **Run and Debug**.
3. In the Extension Development Host, open the [lenient example](../comprehensive-example.yini) and [strict example](../comprehensive-example.strict.yini).
4. Confirm that the language mode says **YINI**.
5. Check escaped strings, command strings, backticked names, nested objects, comments, and disabled lines.
6. Switch between a light theme, a dark theme, and both built-in high-contrast themes. Comments should be readable green; disabled lines should remain separate.

Use **Developer: Inspect Editor Tokens and Scopes** to see the labels assigned by the grammar. Check that text such as `#`, `--`, and section markers inside command strings remains string content. Check that normal highlighting resumes after the closing delimiter.

No build step is needed. See the [color settings guide](VSCode.md) for the repository's green-comment rules.

## Prepare the local package

Keep the extension identity `yini-lang.yini-syntax-highlighting`. Update the extension version in both package files when preparing a release; it is independent of the specification version. Keep the changelog entry marked **Unreleased** until a release date is chosen.

Inspect the included files, then build the VSIX:

```shell
npm run package:check
npm run package
```

For version `1.1.0`, this creates `yini-syntax-highlighting-1.1.0.vsix` in the repository root. The package should include the grammar, language configuration, icon, README, changelog, support information, and license. Development dependencies, tests, examples, workspace settings, and maintainer documentation are excluded.

Repository links in the README should resolve on GitHub when viewed from the Marketplace. Check the packaged README too.

## Test an isolated local installation

Use a separate profile and extension directory so testing does not replace your installed extension. For example, run these commands in PowerShell from the repository root:

```powershell
$yiniTestRoot = Join-Path $env:TEMP "yini-rc7-vscode"
code --user-data-dir "$yiniTestRoot/profile" --extensions-dir "$yiniTestRoot/extensions" --install-extension ./yini-syntax-highlighting-1.1.0.vsix --force
code --user-data-dir "$yiniTestRoot/profile" --extensions-dir "$yiniTestRoot/extensions" --list-extensions --show-versions
code --user-data-dir "$yiniTestRoot/profile" --extensions-dir "$yiniTestRoot/extensions" --new-window .
```

Confirm that the installed identity and version are `yini-lang.yini-syntax-highlighting@1.1.0`. Open both comprehensive examples and repeat the highlighting checks.

This folder uses the repository's comment-color settings. Open a YINI file outside the repository to confirm that a normal installation respects the chosen theme.

## Finish release preparation

Before publishing, check that:

- `npm ci` and `npm test` pass.
- Markdown links work and examples match the documented behavior.
- Package contents are correct and the VSIX installs locally.
- Highlighting and comment colors have been reviewed in VS Code.
- The changelog describes the final changes and any remaining limitations.

Building or installing the local VSIX does not publish it. Publishing, pushing a release tag, and creating a public release are separate steps.

After a future Marketplace release, use a separate test profile to install `yini-lang.yini-syntax-highlighting` from the Marketplace and repeat the checks. Until then, the local VSIX is the candidate being tested.
