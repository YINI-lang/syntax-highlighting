import {
  failed,
  printResult,
  validateGrammar,
} from "@carlwr/textmate-validate";

const grammarPath = "syntaxes/yini.tmLanguage.json";
const result = await validateGrammar(grammarPath);

if (failed(result)) {
  printResult(result, 1, true);
  process.exitCode = 1;
} else {
  console.log(`All ${result.length} TextMate regular expressions are valid.`);
}
