import { MergedSubtitles } from "./srt.ts";

const $GAP: unique symbol = Symbol("GAP");
type Gap = typeof $GAP;

export function renderSubs(merged: MergedSubtitles): string {
  const subLayout: ([number, string] | Gap)[] = layoutSubs(merged);
  const htmlSubs = subLayout.map((elem) => {
    if (elem === $GAP) {
      return `<li class="GAP">&nbsp</li>`;
    }
    const [langIndex, sub] = elem;
    return `<li class="sub lang-${langIndex}">${sub}</li>`;
  });
  const subsHtml = htmlSubs.join("\n");
  return renderTemplate(subsHtml);
}

function layoutSubs(
  merged: MergedSubtitles,
): ([number, string] | Gap)[] {
  const mergedJSON = merged.toJSON();
  // we won't use time for now
  const simplifiedSubs: [number, string][] = mergedJSON.map((
    [langIndex, [_start, _end, text]],
  ) => [langIndex, text]);

  const subLayout: ([number, string] | Gap)[] = [];
  let insertedGap = true;
  for (const [langIndex, text] of simplifiedSubs) {
    if (!insertedGap && langIndex === 0) {
      subLayout.push($GAP);
      insertedGap = true;
    } else {
      insertedGap = false;
    }
    subLayout.push([langIndex, text]);
  }
  return subLayout;
}

function renderTemplate(subsHtml: string): string {
  return TEMPLATE.replace(SUBS_KEYWORD, subsHtml);
}

const SUBS_KEYWORD = `<!--SUBST-->`;
const TEMPLATE = `<!DOCTYPE html>
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
<body><ul class="allsubs">${SUBS_KEYWORD}</ul></body>
</html>`;
