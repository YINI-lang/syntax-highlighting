# Support

For bugs, incorrect highlighting, and feature requests, open an issue in the [YINI syntax-highlighting repository](https://github.com/YINI-lang/yini-syntax-highlighting/issues).

Please include a small YINI example, the expected highlighting, the actual highlighting, your editor and version, and the theme you use.

For VS Code, include the extension version and any custom color settings. For Notepad++, include its version, the Git commit or release you downloaded the XML from, your installation method, and any UDL changes. Both definitions target YINI Specification 1.0.0-RC.7. If the issue concerns strict mode, include the parser or CLI version and how you selected that mode.

For comment colors or disabled-line appearance, see the [VS Code settings guide](https://github.com/YINI-lang/yini-syntax-highlighting/blob/main/docs/VSCode.md). A theme can change a token's color even when the extension identifies it correctly.

For Notepad++, see the [build and installation guide](https://github.com/YINI-lang/yini-syntax-highlighting/blob/main/notepadplusplus/README.md), including supported features, color customization, and known UDL limitations. The XML is ready to import and does not need compilation. `npm run test:udl` checks the definition's structure; include a screenshot or a small reproduction for an editor highlighting problem.
