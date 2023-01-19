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

ci: ci-fmt lint test-all

ci-fmt:
    deno fmt --check src test

docker-ci: clean docker-build-image docker-build-multisrt

docker-build-image:
    docker build -f Dockerfile.build -t multisrt-build .

docker-build-multisrt:
    #!/usr/bin/env sh
    set -euxo pipefail
    docker run --cidfile multisrt.build.cid multisrt-build
    cid=`cat multisrt.build.cid`
    rm multisrt.build.cid
    mkdir -p dist
    docker cp "$cid":/multisrt/dist/multisrt.js dist/multisrt.js
