default:
    just --list --justfile {{justfile()}}

clean:
    rm -rf dist

fmt:
    deno fmt src test

lint:
    deno lint src test

update-deps:
    deno run -A https://deno.land/x/udd/main.ts import_map.json

test-all: unittest itest

unittest:
	deno test --allow-read --allow-write --allow-run src

itest: build
	deno test --allow-read --allow-write --allow-run test/integration.test.ts

example:
    mkdir -p dist
    deno run --allow-read src/main.ts test/test.eng.srt test/test.fre.srt test/test.ger.srt test/test.ita.srt test/test.spa.srt > $@

build:
    mkdir -p dist
    deno bundle src/main.ts dist/multisrt.js
