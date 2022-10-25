import constants from "../constants.json" assert { type: "json" };
import { testFilePath, withTempDir } from "./util.ts";
import { fromFileUrl, join } from "std/path/mod.ts";
import { assertStrictEquals } from "std/testing/asserts.ts";
import { EXPECTED } from "../src/render.test.ts";

const { SUPPORTED_DENO_VERSION } = constants;

const SCRIPT_PATH = fromFileUrl(import.meta.resolve("../dist/multisrt.js"));

Deno.test("end-to-end", async () => {
  await checkVersions();
  await withTempDir(async (tempDirPath: string) => {
    const scriptLocation = await install(tempDirPath);
    await checkUsage(scriptLocation);
    await checkRender(scriptLocation);
  });
});

async function checkVersions() {
  const denoPath = Deno.execPath();
  const cmd = Deno.run({ cmd: [denoPath, "--version"], stdout: "piped" });
  const out = await cmd.output();
  cmd.close();

  const td = new TextDecoder();
  const outText = td.decode(out);
  const denoVersionRe = /^deno ([.0-9]+)/;
  const justVersion = denoVersionRe.exec(outText)![1];

  if (justVersion !== SUPPORTED_DENO_VERSION) {
    console.warn(`installed deno version: ${justVersion}
supported version: ${SUPPORTED_DENO_VERSION}`);
  }
}

type InstallPath = string;
async function install(tempDirPath: string): Promise<InstallPath> {
  const scriptInfo = await Deno.stat(SCRIPT_PATH);
  if (!scriptInfo.isFile) {
    throw `no bundle found at ${SCRIPT_PATH}: please make it before running tests`;
  }

  const denoPath = Deno.execPath();
  const cmd = Deno.run({
    cmd: [
      denoPath,
      "install",
      "--allow-read",
      "--root",
      tempDirPath,
      SCRIPT_PATH,
    ],
  });
  const { success, code } = await cmd.status();
  cmd.close();
  if (!success) {
    throw `deno install failed with code ${code}`;
  }

  return join(tempDirPath, "bin", "multisrt");
}

async function checkUsage(scriptLocation: string) {
  const cmd = Deno.run({ cmd: [scriptLocation], stderr: "piped" });
  const err = await cmd.stderrOutput();
  cmd.close();

  const td = new TextDecoder();
  const errText = td.decode(err);
  assertStrictEquals(
    errText,
    "usage: multisrt [srt file 1] [srt file 2...]\n",
  );
}

async function checkRender(scriptLocation: string) {
  const TEST_FILE_LANGS = ["eng", "fre", "ger", "ita", "spa"];
  const testFileNames = TEST_FILE_LANGS.map((lang) => `test.${lang}.srt`);
  const testFilePaths = testFileNames.map((name) => testFilePath(name));

  const cmd = Deno.run({
    cmd: [scriptLocation, ...testFilePaths],
    stdout: "piped",
  });
  const out = await cmd.output();
  cmd.close();

  const td = new TextDecoder();
  const outText = td.decode(out);
  assertStrictEquals(outText, EXPECTED);
}
