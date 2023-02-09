import * as esbuild from "esbuild";
import * as path from "std/path/mod.ts";

const MAIN_PATH = path.fromFileUrl(import.meta.resolve("../src/main.ts"));
const OUT_PATH = path.fromFileUrl(import.meta.resolve("../dist/multisrt.js"));

async function main() {
  const outDir = path.dirname(OUT_PATH);
  await Deno.mkdir(outDir, { recursive: true });

  const denoBinPath = Deno.execPath();
  const cmd = new Deno.Command(denoBinPath, {
    args: ["bundle", MAIN_PATH],
    stdout: "piped",
  });
  const { success, code, stdout } = await cmd.output();
  if (!success) {
    throw `Failed to bundle: ${code}`;
  }

  const buildOptions: esbuild.BuildOptions = {
    treeShaking: true,
  };
  const build = await esbuild.transform(stdout, buildOptions);
  esbuild.stop();
  if (build.warnings.length > 0) {
    throw `Warnings from esbuild: ${warnings}`;
  }

  await Deno.writeTextFile(OUT_PATH, build.code);
}

if (import.meta.main) {
  await main();
}
