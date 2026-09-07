# Maintainer-Doc

## Test this in VS Code immediately
No build or dependency installation is required.

1. Open this repository’s root folder in VS Code.
2. Press `F5`, or select `Run and Debug` → `Run Extension`.
3. A new `Extension Development Host` window will open.
4. In that window, open:
   - [comprehensive-example.yini](D:/Sources/YINI-lang-WORK/syntax-highlighting/comprehensive-example.yini)
   - [comprehensive-example.strict.yini](D:/Sources/YINI-lang-WORK/syntax-highlighting/comprehensive-example.strict.yini)
5. Confirm the language mode in the lower-right corner says YINI.

To inspect exact highlighting scopes:
1. Place the cursor on a token.
2. Open the Command Palette with `Ctrl+Shift+P`.
3. Run Developer: Inspect Editor Tokens and Scopes.

---

## Packaging as VSCode Extension

The following is the process of packaging this project as a VSCode extension.

### 1. Install the Publishing Tool

If `vsce` is not yet installed, install by:
```bash
npm install -g vsce
```

### 2. Package the Extension

From the `yini-syntax` project root:
```bash
vsce package
```
This will create a file like `yini-syntax-1.0.0.vsix`.

## Install Local Extension

### 1. Install Extension Globally in VSCode:

Install the created file, in above steps, in VSCode:
```bash
code --install-extension yini-syntax-1.0.0.vsix
```

---

**^YINI ≡**  
> A simple, structured, and human-friendly configuration format.  

[yini-lang.org](https://yini-lang.org) · [YINI on GitHub](https://github.com/YINI-lang)  
