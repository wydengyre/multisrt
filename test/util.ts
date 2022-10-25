import { fromFileUrl, join } from "std/path/mod.ts";
import { emptyDir } from "std/fs/empty_dir.ts";

const TEST_DIR_PATH = fromFileUrl(import.meta.resolve("./"));

export function readTestFile(filename: string): Promise<Uint8Array> {
  const filePath = testFilePath(filename);
  return Deno.readFile(filePath);
}

export function testFilePath(filename: string) {
  return join(TEST_DIR_PATH, filename);
}

export async function withTempDir(
  f: (tempDirPath: string) => Promise<void>,
) {
  const tempDirPath = await Deno.makeTempDir();
  try {
    await f(tempDirPath);
  } catch (e) {
    throw e;
  } finally {
    await emptyDir(tempDirPath);
  }
}
