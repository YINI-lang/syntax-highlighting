import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createRegistry, loadConfiguration } = require(
  "../node_modules/vscode-tmgrammar-test/dist/common/index.js",
);
const { grammars } = loadConfiguration(undefined, undefined, []);
const grammar = await createRegistry(grammars).loadGrammar("source.yini");

// Use the grammar's string and comment state instead of matching raw lines.
export function orderedFeatures(contents) {
  const sections = [];
  const members = [];
  let state;

  for (const line of contents.split(/\r\n|\r|\n/u)) {
    const result = grammar.tokenizeLine(line, state);
    state = result.ruleStack;

    for (const token of result.tokens) {
      const name = line.slice(token.startIndex, token.endIndex);
      if (token.scopes.includes("entity.name.section.yini")) {
        sections.push(name);
      } else if (
        token.scopes.includes("variable.other.key.yini") &&
        !token.scopes.includes("meta.object.member.yini")
      ) {
        members.push(name);
      }
    }
  }

  return { sections, members };
}
