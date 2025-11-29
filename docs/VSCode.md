## Customizing Disabled Line Appearance in VSCode

By default, lines starting with `--` in YINI files are marked with the scope `meta.line.disabled.yini`.
If you want these lines to appear dimmed or "ghosted," you can add a custom color rule to your VSCode settings.

**How to do it:**

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select **Preferences: Open Settings (JSON)**.
2. Add the following inside your settings file (usually at the top level):

    ```json
    "editor.tokenColorCustomizations": {
      "textMateRules": [
        {
          "scope": "meta.line.disabled.yini",
          "settings": {
            "foreground": "#777777",    // Light gray for "ghosted"
            "fontStyle": "italic"
          }
        }
      ]
    }
    ```

3. Save the file and reload VSCode (if necessary).

Now, any line starting with `--` in a YINI file will appear dimmed and italicized.

> 💡 **Tip:** You can customize the color and font style as you like!

---

**^YINI ≡**  
> A simple, structured, and human-friendly configuration format.  

[yini-lang.org](https://yini-lang.org) · [YINI on GitHub](https://github.com/YINI-lang)  
