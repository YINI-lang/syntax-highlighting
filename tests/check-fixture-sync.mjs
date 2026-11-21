import { readFile } from "node:fs/promises";
import { orderedFeatures } from "./fixture-features.mjs";

const fixturePaths = [
  "comprehensive-example.yini",
  "comprehensive-example.strict.yini",
];

const [lenient, strict] = await Promise.all(
  fixturePaths.map(async (path) => orderedFeatures(await readFile(path, "utf8"))),
);

if (JSON.stringify(lenient) !== JSON.stringify(strict)) {
  console.error("The comprehensive examples have different sections, members, or ordering.");
  console.error(`Lenient: ${JSON.stringify(lenient, null, 2)}`);
  console.error(`Strict:  ${JSON.stringify(strict, null, 2)}`);
  process.exitCode = 1;
} else {
  console.log(
    `Fixture order is synchronized (${lenient.sections.length} sections and ${lenient.members.length} members).`,
  );
}
