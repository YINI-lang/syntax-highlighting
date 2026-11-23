import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sax from "sax";

function readDefinition() {
  const source = readFileSync(new URL("../notepadplusplus/YINI_byYINI-lang.xml", import.meta.url), "utf8");
  const parser = sax.parser(true, { strictEntities: true });
  const document = { children: [], text: "" };
  const stack = [document];

  parser.onerror = (error) => {
    throw error;
  };
  parser.ondoctype = () => {
    throw new Error("The UDL must not contain a DOCTYPE.");
  };
  parser.onopentag = ({ name, attributes }) => {
    const element = { name, attributes, children: [], text: "" };
    stack.at(-1).children.push(element);
    stack.push(element);
  };
  parser.ontext = (text) => {
    stack.at(-1).text += text;
  };
  parser.onclosetag = () => {
    stack.pop();
  };
  parser.write(source).close();

  return document;
}

function child(parent, name) {
  const matches = parent.children.filter((element) => element.name === name);
  assert.equal(matches.length, 1, `Expected exactly one ${name} element.`);
  return matches[0];
}

function namedEntries(parent, elementName) {
  const entries = new Map();
  for (const element of parent.children) {
    assert.equal(element.name, elementName);
    const name = element.attributes.name;
    assert.ok(name, `${elementName} needs a name.`);
    assert.ok(!entries.has(name), `Duplicate ${elementName}: ${name}.`);
    entries.set(name, element);
  }
  return entries;
}

function definition() {
  return child(child(readDefinition(), "NotepadPlus"), "UserLang");
}

function keywords(udl) {
  return namedEntries(child(udl, "KeywordLists"), "Keywords");
}

function words(element) {
  return element.text.trim().split(/\s+/).filter(Boolean);
}

function delimiterFields(udl) {
  const encoded = keywords(udl).get("Delimiters").text.trim();
  const parts = [...encoded.matchAll(/(?:^|\s)(\d{2})(?=\D|$)/g)];
  assert.equal(parts.length, 24, "Each delimiter needs an open, escape, and close field.");
  return parts.map((part, index) => {
    assert.equal(Number(part[1]), index, "Delimiter fields must be ordered from 00 to 23.");
    return encoded.slice(part.index + part[0].length, parts[index + 1]?.index).trim();
  });
}

test("UDL XML has a single YINI language and required sections", () => {
  // 1. Arrange.
  const udl = definition();

  // 2. Act.
  const settings = child(udl, "Settings");
  const lists = keywords(udl);

  // 3. Assert.
  assert.deepEqual(udl.attributes, { name: "YINI", ext: "yini", udlVersion: "2.1" });
  assert.equal(child(settings, "Global").attributes.caseIgnored, "yes");
  assert.equal(child(settings, "Global").attributes.forcePureLC, "0");
  assert.equal(child(settings, "Global").attributes.decimalSeparator, "0");
  for (let index = 1; index <= 8; index += 1) {
    assert.equal(child(settings, "Prefix").attributes[`Keywords${index}`], "no");
    assert.ok(lists.has(`Keywords${index}`));
  }
  for (const name of ["prefix1", "prefix2", "extras1", "extras2", "suffix1", "suffix2", "range"]) {
    assert.ok(lists.has(`Numbers, ${name}`));
  }
  for (const location of ["code1", "code2", "comment"]) {
    for (const boundary of ["open", "middle", "close"]) {
      assert.ok(lists.has(`Folders in ${location}, ${boundary}`));
    }
  }
});

test("UDL keeps literals in agreement with the TextMate grammar", () => {
  // 1. Arrange.
  const grammar = JSON.parse(readFileSync(new URL("../syntaxes/yini.tmLanguage.json", import.meta.url), "utf8"));
  const booleans = grammar.patterns.find((pattern) => pattern.name === "constant.language.boolean.yini");

  // 2. Act.
  const lists = keywords(definition());
  const booleanWords = booleans.match.match(/\(([a-z|]+)\)/)[1].split("|");

  // 3. Assert.
  assert.deepEqual(words(lists.get("Keywords1")).sort(), booleanWords.sort());
  assert.deepEqual(words(lists.get("Keywords2")), ["null"]);
  assert.deepEqual(words(lists.get("Keywords3")), ["@yini", "strict", "lenient", "/END"]);
  assert.ok(words(lists.get("Operators1")).includes("<"));
  assert.ok(words(lists.get("Operators1")).includes(">"));
  for (const prefix of ["hex:", "0x", "0b", "%", "0o", "0z"]) {
    assert.ok(words(lists.get("Numbers, prefix2")).includes(prefix));
  }
});

test("UDL groups alternate string openers and gives triple quotes priority", () => {
  // 1. Arrange.
  const fields = delimiterFields(definition());

  // 2. Act.
  const openers = fields.filter((_, index) => index % 3 === 0);
  const openerGroups = openers.map((opener) => {
    if (opener.startsWith("((") && opener.endsWith("))")) {
      return opener.slice(2, -2).split(/\s+/);
    }
    return [opener];
  });
  const escapes = fields.filter((_, index) => index % 3 === 1);
  const closers = fields.filter((_, index) => index % 3 === 2);

  // 3. Assert.
  assert.deepEqual(openerGroups, [
    ['E"""', 'e"""', 'C"""', 'c"""'],
    ['command"""', 'R"""', 'r"""', '"""'],
    ["E'", "e'", "C'", "c'"],
    ['E"', 'e"', 'C"', 'c"'],
    ["R'", "r'", "'"],
    ['R"', 'r"', '"'],
    ["`"],
    ["--"],
  ]);
  assert.deepEqual(escapes, ["\\", "", "\\", "\\", "", "", "\\", ""]);
  assert.equal(closers[0], '"""');
  assert.equal(closers[1], '"""');
});

test("UDL single-line strings and names recover at line endings", () => {
  // 1. Arrange.
  const fields = delimiterFields(definition());

  // 2. Act.
  const closers = [2, 3, 4, 5, 6].map((group) => fields[group * 3 + 2]);

  // 3. Assert.
  assert.deepEqual(closers, ["((' EOL))", '((" EOL))', "((' EOL))", '((" EOL))', "((` EOL))"]);
});

test("UDL disabled lines have a separate style and cannot contain comments or strings", () => {
  // 1. Arrange.
  const udl = definition();

  // 2. Act.
  const fields = delimiterFields(udl);
  const styles = namedEntries(child(udl, "Styles"), "WordsStyle");
  const comments = keywords(udl).get("Comments").text;

  // 3. Assert.
  assert.deepEqual(fields.slice(21), ["--", "", "((EOL))"]);
  assert.ok(!comments.includes("--"), "Disabled lines must not be registered as comments.");
  for (const token of ["00//", "00#", "00;", "03/*", "04*/"]) {
    assert.ok(comments.includes(token));
  }
  assert.equal(styles.size, 24);
  assert.equal(new Set([...styles.values()].map((style) => style.attributes.styleID)).size, 24);
  assert.equal(styles.get("DELIMITERS8").attributes.fontStyle, "2");
  assert.notEqual(styles.get("DELIMITERS8").attributes.fgColor, styles.get("LINE COMMENTS").attributes.fgColor);
  for (let index = 1; index <= 8; index += 1) {
    assert.equal(styles.get(`DELIMITERS${index}`).attributes.styleID, String(15 + index));
    assert.equal(styles.get(`DELIMITERS${index}`).attributes.nesting, "0");
  }
  for (const style of styles.values()) {
    assert.match(style.attributes.fgColor, /^[0-9A-F]{6}$/);
    assert.ok(["0", "1"].includes(style.attributes.colorStyle), "Styles must inherit the theme background.");
    assert.equal(style.attributes.fontName, "");
    assert.equal(style.attributes.nesting, "0");
  }
});
