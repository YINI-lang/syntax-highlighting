# Maintainer guide

## Test the extension in VS Code

1. Open this repository's root folder in VS Code.
2. Press `F5`, or open **Run and Debug** and select **Run Extension**.
3. In the Extension Development Host, open either [the lenient example](../comprehensive-example.yini) or [the strict example](../comprehensive-example.strict.yini).
4. Confirm that the language mode in the lower-right corner says **YINI**.

To inspect the exact highlighting assigned to a token, place the cursor on it and run **Developer: Inspect Editor Tokens and Scopes** from the Command Palette.

No build step is needed for this manual check.

## Run the automated tests

Install the exact development dependencies recorded in `package-lock.json`, then run the complete test suite:

```shell
npm ci
npm test
```

The suite validates every TextMate regular expression, checks representative token scopes, confirms that the comprehensive examples remain synchronized, and parses both examples with the appropriate YINI mode.

Individual checks are also available:

```shell
npm run test:grammar
npm run test:scopes
npm run test:fixtures
npm run test:yini
```

## Package the extension

First inspect the files that will be included:

```shell
npm run package:check
```

Then create the VSIX package:

```shell
npm run package
```

For version `1.0.0`, this creates `yini-syntax-highlighting-1.0.0.vsix` in the repository root.

Install it locally with:

```shell
code --install-extension yini-syntax-highlighting-1.0.0.vsix
```
