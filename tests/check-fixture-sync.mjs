import { readFile } from "node:fs/promises";

const fixturePaths = [
  "comprehensive-example.yini",
  "comprehensive-example.strict.yini",
];

function orderedFeatures(contents) {
  const lines = contents.split(/\r?\n/u);
  const sections = [];
  const members = [];

  for (const line of lines) {
    const section = line.match(
      /^\s*[\^§<>](?:_?[\^§<>]|\d)*\s+(`[^`]+`|[A-Za-z_][A-Za-z0-9_]*)/u,
    );
    if (section) {
      sections.push(section[1]);
      continue;
    }

    const member = line.match(
      /^\s*(`[^`]+`|[A-Za-z_][A-Za-z0-9_]*)\s*[:=]/u,
    );
    if (member) {
      members.push(member[1]);
    }
  }

  return { sections, members };
}

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
