# Customizing disabled lines in VS Code

Lines beginning with `--` receive the TextMate scope `meta.line.disabled.yini`. The extension does not force a color, so your active theme controls their appearance by default.

If you want disabled lines to look dimmed or italicized, add a rule to your user settings:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "meta.line.disabled.yini",
        "settings": {
          "foreground": "#777777",
          "fontStyle": "italic"
        }
      }
    ]
  }
}
```

Open the Command Palette with `Ctrl+Shift+P` or `Cmd+Shift+P`, then select **Preferences: Open User Settings (JSON)**. If the settings file already contains `editor.tokenColorCustomizations`, merge the `textMateRules` entry into it instead of adding a second property with the same name.

You may omit `foreground` to keep the color selected by your theme and apply only italics.
