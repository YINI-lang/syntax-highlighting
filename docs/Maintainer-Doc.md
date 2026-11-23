# Maintainer guide

The TextMate grammar and Notepad++ UDL target YINI Specification 1.0.0-RC.7. See the [compatibility notes](RC7-Compatibility.md) for the source version and coverage. Keep both definitions in the same specification-update pull request, using the four shared public examples. See the [Notepad++ guide](../notepadplusplus/README.md) for its build and installation steps, supported features, and limitations.

## Run the automated checks

Use Node.js 22.9 or newer. CI uses Node.js 24. Install the exact development dependencies recorded in `package-lock.json`, then run the tests:

```shell
npm ci
npm test
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

The suite checks the TextMate grammar's regular expressions, token labels, Notepad++ XML and UDL configuration, example order, and parsing in both modes. It also checks RC.7 string values, expected warnings, and invalid inputs. The parser and CLI are both pinned to version 2.0.0. XML checks do not run Notepad++; rendering needs a separate editor check.

The four public examples must pass without warnings. Intentional warning cases belong in `tests/fixtures/rc7-warnings.yini`. Their tests check the warnings and verify that the CLI fails when `--warnings-as-errors` is selected.

Individual checks are available:

```shell
npm run test:grammar
npm run test:scopes
npm run test:fixtures
npm run test:yini
npm run test:rc7
npm run test:udl
```

Files ending in `.test.yini` contain highlighting assertions. They are test inputs, not complete example documents to validate with the CLI.

---

## Check highlighting in VS Code

1. Open this repository's root folder in VS Code.
2. Press `F5`, or choose **Run Extension** in **Run and Debug**.
3. In the Extension Development Host, open the [lenient example](../comprehensive-example.yini) and [strict example](../comprehensive-example.strict.yini).
4. Confirm that the language mode says **YINI**.
5. Check escaped strings, command strings, backticked names, nested objects, comments, and disabled lines.
6. Switch between a light theme, a dark theme, and both built-in high-contrast themes. Comments should be readable green; disabled lines should remain separate.

Use **Developer: Inspect Editor Tokens and Scopes** to see the labels assigned by the grammar. Check that text such as `#`, `--`, and section markers inside command strings remains string content. Check that normal highlighting resumes after the closing delimiter.

No build step is needed. See the [color settings guide](VSCode.md) for the repository's green-comment rules.

---

## Check highlighting in Notepad++

Edit `notepadplusplus/YINI_byYINI-lang.xml` directly. It is the ready-to-import artifact, so no build step is needed. The [Notepad++ guide](../notepadplusplus/README.md) covers import, separate-file installation, updates, and colors.

Use an isolated configuration to avoid replacing your installed YINI definition. For example, in PowerShell from the repository root:

```powershell
$yiniNppRoot = Join-Path $env:TEMP ("yini-npp-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path "$yiniNppRoot/userDefineLangs" -Force
Copy-Item -LiteralPath ./notepadplusplus/YINI_byYINI-lang.xml -Destination "$yiniNppRoot/userDefineLangs/YINI_byYINI-lang.xml"
& "$env:ProgramFiles/Notepad++/notepad++.exe" -multiInst -nosession -noPlugin "-settingsDir=$yiniNppRoot" ./sample.yini
```

Adjust the executable path for your installation. Open the other three public examples in that test instance. Confirm automatic `.yini`, `.strict.yini`, and `.YINI` language selection, green comments, separate gray italic disabled lines, string-prefix handling, and highlighting after closing delimiters. Check both light and dark themes and adjust UDL colors if needed.

Use `tests/fixtures/notepadplusplus-boundaries.yini` for deliberate invalid input and the known command-string boundary limitation. Check single-line recovery, raw versus escaped quotes, backticked names, and an odd number of embedded triple quotes in a command body. Do not validate this manual fixture as a public example.

Record the editor version and checks performed. When the specification changes, update both editor definitions or explain a UDL limitation in the guide and compatibility notes. The existing TextMate assertion fixtures test scopes and cannot directly test UDL rendering.

---

## Prepare the local packages

Keep the extension identity `yini-lang.yini-syntax-highlighting`. Update the extension version in both package files when preparing a release; it is independent of the specification version. Keep the changelog entry marked **Unreleased** until a release date is chosen.

Inspect the included files, then build the VSIX:

```shell
npm run package:check
npm run package
```

For version `1.1.0`, this creates `yini-syntax-highlighting-1.1.0.vsix` in the repository root. The package should include the grammar, language configuration, icon, README, changelog, support information, and license. Development dependencies, tests, examples, workspace settings, maintainer documentation, and `notepadplusplus/**` are excluded.

For Notepad++, distribute `notepadplusplus/YINI_byYINI-lang.xml` directly. `npm run test:udl` validates it; there is no generated or compiled UDL package. Use a Git commit or release to identify the XML revision when testing or reporting issues.

Repository links in the README should resolve on GitHub when viewed from the Marketplace. Check the packaged README too.

---

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

---

## Finish release preparation

Before publishing, check that:

- `npm ci` and `npm test` pass.
- Markdown links work and examples match the documented behavior.
- Package contents are correct and the VSIX installs locally.
- Highlighting and comment colors have been reviewed in VS Code.
- The Notepad++ XML imports in a clean configuration, and the shared examples and boundary fixture have been checked in Notepad++. Record the tested editor version and any remaining limitations.
- The changelog describes the final changes and any remaining limitations.

Building or installing the local VSIX does not publish it. Publishing, pushing a release tag, and creating a public release are separate steps.

---

## Publish through the Marketplace website

You can publish the VSIX file through the Marketplace website. See the [official publishing guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publish-an-extension).

Before uploading, replace **Unreleased** in `CHANGELOG.md` with the release date, then run `npm run package` again to include that change. If version `1.1.0` has already been published, choose a higher version, update both package files, and build a new package. Use the matching version and filename in the steps below.

1. Open [Manage Marketplace extensions](https://marketplace.visualstudio.com/manage).
2. Sign in with the Microsoft account that manages the **`yini-lang`** publisher.
3. Select that publisher and find **YINI Syntax Highlighting**.
4. Open its **… / More actions** menu and choose **Update**. Use the existing extension entry to keep the identity `yini-lang.yini-syntax-highlighting`.
5. Upload the file from your repository root:

   ```text
   yini-syntax-highlighting-1.1.0.vsix
   ```

6. Submit the update and wait for Marketplace validation to finish.
7. Check the [public listing](https://marketplace.visualstudio.com/items?itemName=yini-lang.yini-syntax-highlighting) and confirm that version **1.1.0** appears.

After publishing, use a separate test profile to install `yini-lang.yini-syntax-highlighting` from the Marketplace and repeat the highlighting checks.
