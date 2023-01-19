# multisrt

`multisrt` is a script that generates an HTML-based, merged view of multiple SRT subtitle files.

It's useful for intermediate to advanced students of foreign languages.
Such students can benefit from reading human translations of movie and television dialog.
Audiovisual media are full of speech in the colloquial register, which can be hard to
study using more traditional sources.

# Usage

English and French: `multisrt subtitles.english.srt subtitles.french.srt`

English, French, and Spanish (up to five languages supported):
`multisrt subtitles.english.srt subtitles.french.srt subtitles.spanish.srt`

To extract subtitles from MKV sources, try [mkvsubs](https://github.com/wydengyre/mkvsubs).

# Installation

You'll need [deno](https://deno.land).
If you build from source, you'll need [just](https://github.com/casey/just).

You can install from source:

    just build
    deno install --allow-read dist/multisrt.js

Or you can install from a release:
The `deno install` command can also be used, as above, with a `multisrt.js` file downloaded from GitHub releases.
