import { MergedSubtitles, parse, Subtitle } from "./srt.ts";
import { readTestFile } from "../test/util.ts";
import { assertStrictEquals } from "std/testing/asserts.ts";

Deno.test("subtitle parse", async () => {
  const TEST_FILE_NAME = "test.eng.srt";
  const engSubs: Subtitle[] = await parseTestFile(TEST_FILE_NAME);
  assertJSONEquals(engSubs, EXPECTED_ENG_SUBS);
});

Deno.test("subtitle merge", async () => {
  const TEST_FILE_LANGS = ["eng", "fre", "ger", "ita", "spa"];
  const TEST_FILE_NAMES = TEST_FILE_LANGS.map((lang) => `test.${lang}.srt`);
  const testSubs: Subtitle[][] = await Promise.all(
    TEST_FILE_NAMES.map((name) => parseTestFile(name)),
  );

  const merged = MergedSubtitles.fromStreams(testSubs);
  assertJSONEquals(merged, EXPECTED_MERGED_SUBS);
});

async function parseTestFile(filename: string): Promise<Subtitle[]> {
  const content = await readTestFile(filename);
  return parse(content);
}

function assertJSONEquals(l: unknown, r: unknown) {
  assertStrictEquals(JSON.stringify(l), JSON.stringify(r));
}

const EXPECTED_ENG_SUBS = [
  [
    3549,
    5290,
    "...the colossus of Rhodes!",
  ],
  [
    5757,
    6678,
    "No!",
  ],
  [
    6715,
    12544,
    "The colossus of Rhodes\nand it is here just for you Proog.",
  ],
  [
    41626,
    43548,
    "It is there...",
  ],
  [
    43584,
    46665,
    "I'm telling you,\nEmo...",
  ],
];

const EXPECTED_MERGED_SUBS = [
  [1, [42, 3417, "À votre droite vous pouvez voir...|Ça alors..."]],
  [2, [42, 3417, "Auf der rechten Seite sieht man...|...rate mal..."]],
  [3, [42, 3417, "Alla tua destra puoi vedere...|...ma pensa..."]],
  [4, [42, 3417, "A tu derecha puedes ver...|adivina qué..."]],
  [0, [3549, 5290, "...the colossus of Rhodes!"]],
  [1, [3625, 5375, "... le colosse de Rhodes !"]],
  [2, [3625, 5375, "...den Koloss von Rhodos!"]],
  [3, [3625, 5375, "...Il colosso di Rodi!"]],
  [4, [3625, 5375, "...¡El Coloso de Rodas!"]],
  [0, [5757, 6678, "No!"]],
  [1, [6375, 7125, "Non !"]],
  [2, [6458, 7333, "Nein!"]],
  [3, [6458, 7333, "No!"]],
  [4, [6458, 7333, "¡No!"]],
  [
    0,
    [6715, 12544, "The colossus of Rhodes\nand it is here just for you Proog."],
  ],
  [1, [
    7375,
    12375,
    "Le colosse de Rhodes,|et il n'est là que pour toi Proog.",
  ]],
  [
    2,
    [7375, 12792, "Den Koloss von Rhodos|und er ist nur für dich hier, Proog."],
  ],
  [3, [7375, 12792, "Il colosso di Rodi|ed Ã¨ qui solo per te Proog."]],
  [4, [7375, 12792, "El Coloso de Rodas |y está aquí sólo para ti, Proog."]],
  [0, [41626, 43548, "It is there..."]],
  [1, [41958, 43458, "Mais c’est là..."]],
  [2, [41958, 43792, "Es ist da..."]],
  [3, [41958, 43792, "Ãˆ lÃ¬..."]],
  [4, [41958, 43792, "Está ahí..."]],
  [0, [43584, 46665, "I'm telling you,\nEmo..."]],
  [1, [43833, 46125, "Je te le jure,|Emo..."]],
  [2, [43833, 46125, "Wenn ich es dir doch sage,|Emo..."]],
  [3, [43833, 46125, "Te lo stavo dicendo,|Emo..."]],
  [4, [43833, 46125, "Te lo estoy diciendo,|Emo..."]],
];
