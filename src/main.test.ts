import { Buffer } from "std/io/buffer.ts";
import { testFilePath } from "../test/util.ts";
import { go } from "./main.ts";
import { assertEquals, assertStrictEquals } from "std/testing/asserts.ts";
import { EXPECTED } from "./render.test.ts";

Deno.test("usage", async () => {
  const stdout = new Buffer();
  const stderr = new Buffer();
  await go(stdout, stderr, []);

  assertEquals(stdout.bytes({ copy: false }), new Uint8Array());
  const td = new TextDecoder();
  const err = td.decode(stderr.bytes({ copy: false }));

  const EXPECTED = "usage: multisrt [srt file 1] [srt file 2...]\n";
  assertStrictEquals(err, EXPECTED);
});

Deno.test("go", async () => {
  const TEST_FILE_LANGS = ["eng", "fre", "ger", "ita", "spa"];
  const testFileNames = TEST_FILE_LANGS.map((lang) => `test.${lang}.srt`);
  const testFilePaths = testFileNames.map((name) => testFilePath(name));

  const stdout = new Buffer();
  const stderr = new Buffer();

  await go(stdout, stderr, testFilePaths);
  const td = new TextDecoder();
  const out = td.decode(stdout.bytes({ copy: false }));
  assertStrictEquals(out, EXPECTED);
  assertEquals(stderr.bytes(), new Uint8Array());
});
