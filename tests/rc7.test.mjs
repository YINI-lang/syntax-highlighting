import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { parseForTooling } from "yini-parser";
import { orderedFeatures } from "./fixture-features.mjs";

function document(body, strictMode) {
  return parseForTooling(`^ App\n${body}\n/END`, { strictMode });
}

function valid(body, strictMode) {
  const parsed = document(body, strictMode);
  assert.equal(parsed.ok, true, JSON.stringify(parsed.diagnostics));
  assert.deepEqual(parsed.diagnostics, []);
  return parsed.result.App;
}

for (const strictMode of [false, true]) {
  const mode = strictMode ? "strict" : "lenient";

  test(`${mode}: escaped prefixes and quote forms have the same values`, () => {
    for (const prefix of ["E", "e", "C", "c"]) {
      for (const quote of ["'", '"', '"""']) {
        const value = `${prefix}${quote}line\\n\\x41\\\`${quote}`;
        assert.equal(valid(`text = ${value}`, strictMode).text, "line\nA`");
      }
    }
  });

  test(`${mode}: command strings keep literal text and remove indentation`, () => {
    const body = [
      'text = command"""',
      '    echo "hello"',
      '      echo """embedded"""',
      '    # // /* ; -- \\n',
      '    fake = true',
      '    ^ FakeSection',
      '"""',
    ].join("\n");
    assert.equal(
      valid(body, strictMode).text,
      'echo "hello"\n  echo """embedded"""\n# // /* ; -- \\n\nfake = true\n^ FakeSection',
    );
  });

  test(`${mode}: source line endings become LF but escape results stay intact`, () => {
    for (const ending of ["\n", "\r\n", "\r"]) {
      const source = [
        "^ App", 'raw = """first', 'second"""',
        'escaped = E"""first\\r\\n', 'second"""',
        'command = command"""', '  first', '  second', '"""', "/END",
      ].join(ending);
      const parsed = parseForTooling(source, { strictMode });
      assert.equal(parsed.ok, true, JSON.stringify(parsed.diagnostics));
      assert.deepEqual(parsed.diagnostics, []);
      assert.deepEqual(parsed.result.App, {
        raw: "first\nsecond",
        escaped: "first\r\n\nsecond",
        command: "first\nsecond",
      });
    }
  });

  test(`${mode}: identifiers decode their two supported escapes`, () => {
    const source = [
      '^ `a\\`b`', '`path\\\\name` = 1', '`` = 2',
      'object = {hex:10, true: on, null: null}', "/END",
    ].join("\n");
    const parsed = parseForTooling(source, { strictMode });
    assert.equal(parsed.ok, true, JSON.stringify(parsed.diagnostics));
    assert.deepEqual(parsed.diagnostics, []);
    assert.deepEqual(parsed.result, {
      "a`b": { "path\\name": 1, "": 2, object: { hex: 10, true: true, null: null } },
    });
  });

  test(`${mode}: deprecated binary notation remains valid with a warning`, () => {
    const parsed = document("binary = %1010", strictMode);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.result.App.binary, 10);
    assert.equal(parsed.diagnostics.length, 1);
    assert.equal(parsed.diagnostics[0].severity, "warning");
    assert.match(parsed.diagnostics[0].message, /deprecated.*0b/i);
  });

  test(`${mode}: duplicate sections are rejected`, () => {
    const parsed = document("^^ Child\nx = 1\n^^ Child\ny = 2", strictMode);
    assert.equal(parsed.ok, false);
    assert.ok(parsed.diagnostics.some((d) => d.severity === "error" && /duplicate/i.test(d.message)));
  });

  test(`${mode}: invalid section names are rejected`, () => {
    const parsed = parseForTooling("^ bad-name\nx = 1\n/END", { strictMode });
    assert.equal(parsed.ok, false);
    assert.ok(parsed.diagnostics.some((d) => d.severity === "error"));
  });

  test(`${mode}: signed 64-bit integers remain exact`, () => {
    const result = valid("min = -9223372036854775808\nmax = 9223372036854775807", strictMode);
    assert.equal(result.min, -9223372036854775808n);
    assert.equal(result.max, 9223372036854775807n);
  });

  const invalid = [
    ["unknown identifier escape", '`bad\\nname` = 1'],
    ["raw C0 control in identifier", '`bad\u0001name` = 1'],
    ["raw DEL in identifier", '`bad\u007Fname` = 1'],
    ["raw C1 control in identifier", '`bad\u0085name` = 1'],
    ["invalid simple identifier", 'bad-name = 1'],
    ["uppercase command prefix", 'x = Command"""\n  text\n"""'],
    ["single-line command form", 'x = command"text"'],
    ["content after command opener", 'x = command"""text\n"""'],
    ["content after command closer", 'x = command"""\n  text\n""" # invalid'],
    ["integer overflow", "x = 9223372036854775808"],
    ["hexadecimal overflow", "x = 0x8000000000000000"],
    ["floating-point overflow", "x = 1e400"],
    ["floating-point underflow", "x = 1e-400"],
  ];
  for (const [name, body] of invalid) {
    test(`${mode}: rejects ${name}`, () => {
      const parsed = document(body, strictMode);
      assert.equal(parsed.ok, false);
      assert.ok(parsed.diagnostics.some((d) => d.severity === "error"));
    });
  }
}

test("lenient: missing values become null and produce warnings", async () => {
  const source = await readFile(new URL("./fixtures/rc7-warnings.yini", import.meta.url), "utf8");
  const parsed = parseForTooling(source);
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.result.Warnings, {
    deprecatedBinary: 10, missingValue: null, commentOnlyValue: null,
  });
  assert.equal(parsed.diagnostics.length, 3);
  assert.ok(parsed.diagnostics.every((d) => d.severity === "warning"));
  assert.equal(parsed.diagnostics.filter((d) => /empty value/i.test(d.message)).length, 2);
});

test("strict: missing values are rejected", () => {
  assert.equal(document("missing = # comment", true).ok, false);
});

test("lenient: root members are siblings of top-level sections", () => {
  const parsed = parseForTooling('rootKey = 1\n^ App\nx = 2');
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.result, { rootKey: 1, App: { x: 2 } });
  assert.equal(parseForTooling('rootKey = 1\n^ App\nx = 2\n/END', { strictMode: true }).ok, false);
});

test("mode declarations report mismatches without switching modes", () => {
  const strictInLenient = parseForTooling('@yini strict\n^ App\nx = 1\n/END');
  assert.equal(strictInLenient.ok, false);
  assert.ok(strictInLenient.diagnostics.some((d) => d.code === "YINI_MODE_MISMATCH" && d.severity === "error"));
  const lenientInStrict = parseForTooling('@yini lenient\n^ App\nx = 1\n/END', { strictMode: true });
  assert.equal(lenientInStrict.ok, true);
  assert.ok(lenientInStrict.diagnostics.some((d) => d.code === "YINI_MODE_MISMATCH" && d.severity === "warning"));
  const stillStrict = parseForTooling('@yini lenient\n^ App\nx =\n/END', { strictMode: true });
  assert.equal(stillStrict.ok, false);
});

test("lenient: duplicate keys keep the first value and warn", () => {
  const parsed = document("x = 1\nx = 2", false);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.result.App.x, 1);
  assert.ok(parsed.diagnostics.some((d) => d.severity === "warning" && /duplicate/i.test(d.message)));
});

test("inline object separators follow the selected mode", () => {
  assert.deepEqual(valid("object = {first: 1, second = 2}", false).object, { first: 1, second: 2 });
  assert.equal(document("object = {first: 1, second = 2}", true).ok, false);
});

test("lenient: scalar concatenation preserves normalized source spelling", () => {
  const result = valid([
    'decimal = ""+ +1_0.50E+2', 'exponent = ""+1e3', 'hex = ""+0xFF',
    'negativeZero = ""+-0', 'scalars = ""+YES+NULL',
  ].join("\n"), false);
  assert.deepEqual(result, { decimal: "10.50e2", exponent: "1e3", hex: "255", negativeZero: "-0", scalars: "truenull" });
  assert.equal(document('x = ""+42', true).ok, false);
});

test("fixture ordering ignores string contents and object members", () => {
  const features = orderedFeatures([
    '^ `a\\`b`', 'script = command"""', '    fake = true', '    ^ Fake', '"""',
    'text = """', '^ AlsoFake', 'fakeToo = 2', '"""',
    '/* ignored = true */', 'object = {nested: {hex:10}}', '`path\\\\name` = 1',
  ].join("\n"));
  assert.deepEqual(features, {
    sections: ['`a\\`b`'],
    members: ["script", "text", "object", '`path\\\\name`'],
  });
});

test("CLI accepts warnings normally and fails with --warnings-as-errors", () => {
  const cli = fileURLToPath(new URL("../node_modules/yini-cli/dist/index.js", import.meta.url));
  const fixture = fileURLToPath(new URL("./fixtures/rc7-warnings.yini", import.meta.url));
  for (const warningsAsErrors of [false, true]) {
    const args = [cli, "validate", "--format", "json"];
    if (warningsAsErrors) args.push("--warnings-as-errors");
    const result = spawnSync(process.execPath, [...args, fixture], { encoding: "utf8" });
    assert.ifError(result.error);
    assert.equal(result.status, warningsAsErrors ? 1 : 0, result.stderr || result.stdout);
    assert.ok(JSON.parse(result.stdout));
  }
});
