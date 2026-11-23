# Comment colors and disabled lines in VS Code

These settings apply to VS Code only. For Notepad++ build, installation, and UDL color settings, use the [Notepad++ guide](../notepadplusplus/README.md). Its XML is ready to import without compilation; VS Code settings do not affect it.

The extension identifies comments, while your theme normally chooses their color. This repository adds a green color for YINI comments in `.vscode/settings.json`. It covers `//`, `#`, full-line `;`, block comments, and the first-line shebang.

Lines beginning with `--` are disabled lines. They have a separate label, `meta.line.disabled.yini`, and are excluded from the green-comment rule. Comment-like text inside strings and backticked names keeps its usual highlighting.

Installing the extension does not change your theme or user settings.

## Make YINI comments green

Open the Command Palette with `Ctrl+Shift+P` or `Cmd+Shift+P`, then choose **Preferences: Open User Settings (JSON)**. Add the following setting:

<!-- green-settings:start -->
```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "source.yini comment",
        "settings": {
          "foreground": "#6A9955"
        }
      }
    ],
    "[*Light*]": {
      "textMateRules": [
        {
          "scope": "source.yini comment",
          "settings": {
            "foreground": "#008000"
          }
        }
      ]
    },
    "[Default High Contrast]": {
      "textMateRules": [
        {
          "scope": "source.yini comment",
          "settings": {
            "foreground": "#00FF00"
          }
        }
      ]
    },
    "[Default High Contrast Light]": {
      "textMateRules": [
        {
          "scope": "source.yini comment",
          "settings": {
            "foreground": "#006400"
          }
        }
      ]
    }
  }
}
```
<!-- green-settings:end -->

If your settings already contain `editor.tokenColorCustomizations`, merge these entries into it. Keep any existing rules you want to retain.

The rule `source.yini comment` means comments in YINI files only. Comments in other languages keep their colors.

The default green suits dark backgrounds. Theme names containing `Light` use a darker green. VS Code's built-in high-contrast themes have their own greens. A custom theme with a different name may need its own entry. Use your theme's name in square brackets and choose a green that is easy to read against its background.

To restore your theme's comment colors, remove these green-comment rules. See [VS Code's theme guide](https://code.visualstudio.com/docs/configure/themes#editor-syntax-highlighting) for more options.

## Change disabled-line appearance

The extension keeps disabled lines separate from comments. This repository displays them in gray italics. Elsewhere, your theme controls their appearance unless you add a rule.

For gray italic disabled lines, add this entry to your user settings:

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

Merge this rule with existing `textMateRules` rather than adding a second setting with the same name. You can omit `foreground` to keep your theme's color and apply only italics.

## Check which rule supplies a color

Place the cursor on a comment or disabled line and run **Developer: Inspect Editor Tokens and Scopes** from the Command Palette. A scope is the label the grammar gives a piece of text. The inspection window shows that label and the matching color rule.

New escaped strings use scopes ending in `.escaped.yini`. Command strings use `string.quoted.triple.double.command.yini`. Older `C`/`c` strings keep their existing `.classic.yini` scopes, so existing color rules still work.
