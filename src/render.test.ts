import { renderSubs } from "./render.ts";
import { MergedSubtitles, parse, Subtitle } from "./srt.ts";
import { readTestFile } from "../test/util.ts";
import { assertStrictEquals } from "std/testing/asserts.ts";

Deno.test("renderSubs", async () => {
  const TEST_FILE_LANGS = ["eng", "fre", "ger", "ita", "spa"];
  const testFileNames = TEST_FILE_LANGS.map((lang) => `test.${lang}.srt`);
  const testSubs = await Promise.all(
    testFileNames.map((name) => parseTestFile(name)),
  );
  const merged = MergedSubtitles.fromStreams(testSubs);

  const rendered = renderSubs(merged);
  assertStrictEquals(rendered, EXPECTED);
});

async function parseTestFile(filename: string): Promise<Subtitle[]> {
  const content = await readTestFile(filename);
  return parse(content);
}

export const EXPECTED = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
    html {
      font-family: sans-serif;
      font-size: 1.4em;
      line-height: 1.75;
    }

    @media only screen and (min-width: 720px) {
      body {
        max-width: 83.2ex;
        margin: 2em auto;
      }
    }

    ul {
      padding: 0;
      list-style: none;
    }

    li {
      padding-left: 1em;
      position: relative;
    }

    .lang-0 {
      background-color: rgb(178, 205, 251);
    }

    .lang-1 {
      background-color: rgb(247, 237, 148);
    }
    
    .lang-2 {
      background-color: rgb(255, 205, 153);
    }
    
    .lang-3 {
      background-color: rgb(255, 190, 205);
    }
    
    .lang-4 {
      background-color: rgb(205, 205, 205);
    }
</style>
</head>
<body><ul class="allsubs"><li class="sub lang-1">À votre droite vous pouvez voir...|Ça alors...</li>
<li class="sub lang-2">Auf der rechten Seite sieht man...|...rate mal...</li>
<li class="sub lang-3">Alla tua destra puoi vedere...|...ma pensa...</li>
<li class="sub lang-4">A tu derecha puedes ver...|adivina qué...</li>
<li class="GAP">&nbsp</li>
<li class="sub lang-0">...the colossus of Rhodes!</li>
<li class="sub lang-1">... le colosse de Rhodes !</li>
<li class="sub lang-2">...den Koloss von Rhodos!</li>
<li class="sub lang-3">...Il colosso di Rodi!</li>
<li class="sub lang-4">...¡El Coloso de Rodas!</li>
<li class="GAP">&nbsp</li>
<li class="sub lang-0">No!</li>
<li class="sub lang-1">Non !</li>
<li class="sub lang-2">Nein!</li>
<li class="sub lang-3">No!</li>
<li class="sub lang-4">¡No!</li>
<li class="GAP">&nbsp</li>
<li class="sub lang-0">The colossus of Rhodes
and it is here just for you Proog.</li>
<li class="sub lang-1">Le colosse de Rhodes,|et il n'est là que pour toi Proog.</li>
<li class="sub lang-2">Den Koloss von Rhodos|und er ist nur für dich hier, Proog.</li>
<li class="sub lang-3">Il colosso di Rodi|ed Ã¨ qui solo per te Proog.</li>
<li class="sub lang-4">El Coloso de Rodas |y está aquí sólo para ti, Proog.</li>
<li class="GAP">&nbsp</li>
<li class="sub lang-0">It is there...</li>
<li class="sub lang-1">Mais c’est là...</li>
<li class="sub lang-2">Es ist da...</li>
<li class="sub lang-3">Ãˆ lÃ¬...</li>
<li class="sub lang-4">Está ahí...</li>
<li class="GAP">&nbsp</li>
<li class="sub lang-0">I'm telling you,
Emo...</li>
<li class="sub lang-1">Je te le jure,|Emo...</li>
<li class="sub lang-2">Wenn ich es dir doch sage,|Emo...</li>
<li class="sub lang-3">Te lo stavo dicendo,|Emo...</li>
<li class="sub lang-4">Te lo estoy diciendo,|Emo...</li></ul></body>
</html>`;
