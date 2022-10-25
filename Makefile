.PHONY: clean test unittest itest build

dir_guard=@mkdir -p $(@D)

clean:
	rm -rf dist

build: dist/multisrt.js

test: unittest itest

unittest: FORCE
	deno test --allow-read src

itest: dist/multisrt.js
	deno test --allow-read --allow-write --allow-run test/integration.test.ts

dist/example.html: FORCE
	$(dir_guard)
	deno run --allow-read src/main.ts test/test.eng.srt test/test.fre.srt test/test.ger.srt test/test.ita.srt test/test.spa.srt > $@

dist/multisrt.js: FORCE
	$(dir_guard)
	deno bundle src/main.ts $@

FORCE:
