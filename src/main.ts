import { MergedSubtitles, parse, Subtitle } from "./srt.ts";
import { writeAll } from "std/streams/write_all.ts";
import { renderSubs } from "./render.ts";

const USAGE = "usage: multisrt [srt file 1] [srt file 2...]";

function main(): Promise<void> {
  return go(Deno.stdout, Deno.stderr, Deno.args);
}

export async function go(
  stdout: Deno.Writer,
  stderr: Deno.Writer,
  args: string[],
) {
  const te = new TextEncoder();
  if (args.length < 1) {
    return writeAll(stderr, te.encode(USAGE + "\n"));
  }

  const subtitleLoadPromises = args.map((path) => Deno.readFile(path));
  const subfileContents: Uint8Array[] = await Promise.all(subtitleLoadPromises);
  const subs: Subtitle[][] = subfileContents.map((subData) => parse(subData));
  const merged = MergedSubtitles.fromStreams(subs);

  const rendered = renderSubs(merged);
  await writeAll(stdout, te.encode(rendered));
}

if (import.meta.main) {
  await main();
}
