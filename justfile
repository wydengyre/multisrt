default:
    just --list --justfile {{justfile()}}

clean:
    rm -rf dist

fmt:
    deno fmt scripts src test

lint:
    deno lint scripts src test

update-deps:
    deno run -A https://deno.land/x/udd/main.ts import_map.json

test-all: unittest itest

unittest:
	deno test --allow-read --allow-write --allow-run src

itest: build
	deno test --allow-read --allow-write --allow-run test/integration.test.ts

example:
    mkdir -p dist
    deno run --allow-read src/main.ts test/test.eng.srt test/test.fre.srt test/test.ger.srt test/test.ita.srt test/test.spa.srt > dist/example.html

build:
    deno run --unstable --check --allow-env --allow-read --allow-write --allow-run --allow-net scripts/build.ts

ci: ci-fmt lint test-all

ci-fmt:
    deno fmt --check scripts src test
