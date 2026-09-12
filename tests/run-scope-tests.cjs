const fs = require("node:fs");
const glob = require("glob");
const {
  createRegistry,
  loadConfiguration,
} = require("../node_modules/vscode-tmgrammar-test/dist/common/index.js");
const {
  parseGrammarTestCase,
  runGrammarTestCase,
} = require("../node_modules/vscode-tmgrammar-test/dist/unit/index.js");

async function main() {
  const testFiles = glob.sync("tests/**/*.test.yini").sort();
  const { grammars } = loadConfiguration(undefined, undefined, []);
  const registry = createRegistry(grammars);
  let failureCount = 0;

  for (const filename of testFiles) {
    const source = fs.readFileSync(filename, "utf8");
    const testCase = parseGrammarTestCase(source);
    const failures = await runGrammarTestCase(registry, testCase);

    if (failures.length === 0) {
      console.log(`PASS ${filename}`);
      continue;
    }

    failureCount += failures.length;
    for (const failure of failures) {
      const line = testCase.source[failure.srcLine];
      const location = `${filename}:${failure.srcLine + 1}:${failure.start + 1}`;
      console.error(`FAIL ${location}`);
      console.error(`  ${line}`);
      if (failure.missing.length > 0) {
        console.error(`  Missing: ${failure.missing.join(", ")}`);
      }
      if (failure.unexpected.length > 0) {
        console.error(`  Unexpected: ${failure.unexpected.join(", ")}`);
      }
      console.error(`  Actual: ${failure.actual.join(" ")}`);
    }
  }

  if (testFiles.length === 0) {
    console.error("No TextMate scope tests were found.");
    process.exitCode = 1;
  } else if (failureCount > 0) {
    console.error(`${failureCount} scope assertion(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log(`All ${testFiles.length} TextMate scope test files passed.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
