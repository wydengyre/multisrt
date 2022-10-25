import { srtParser } from "neta";

export type Millisecond = number;
export type Subtitle = [Millisecond, Millisecond, string];

const MILLISECONDS_IN_SECOND = 1_000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

function parseTime(str: string): Millisecond {
  const [hours, minutes, secondsAndMilliseconds] = str.split(":");
  const [seconds, milliseconds] = secondsAndMilliseconds.split(",");
  const h = parseInt(hours);
  const m = parseInt(minutes);
  const s = parseInt(seconds);
  const ms = parseInt(milliseconds);
  return (h * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND) +
    (m * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND) +
    (s * MILLISECONDS_IN_SECOND) +
    ms;
}

export function parse(srt: Uint8Array): Subtitle[] {
  const srtData = srtParser(srt);
  return srtData.map((
    { text, time },
  ) => [parseTime(time[0]), parseTime(time[1]), text]);
}

export class MergedSubtitles implements Iterable<[number, Subtitle]> {
  readonly #subs: [number, Subtitle][];

  private constructor(subs: [number, Subtitle][]) {
    this.#subs = subs;
  }

  [Symbol.iterator]() {
    return this.#subs[Symbol.iterator]();
  }

  toJSON(): readonly [number, Subtitle][] {
    return this.#subs;
  }

  toString(): string {
    return this.#subs.toString();
  }

  static fromStreams(
    streams: readonly (readonly Subtitle[])[],
  ): MergedSubtitles {
    const concatenated: [number, Subtitle][] = [];

    let i = 0;
    for (const stream of streams) {
      const labeledStream: [number, Subtitle][] = stream.map((
        sub: Subtitle,
      ) => [i, sub]);
      concatenated.push(...labeledStream);
      i++;
    }

    concatenated.sort(([labelA, [startA, endA]], [labelB, [startB, endB]]) => {
      if (startB !== startA) {
        return startA - startB;
      }
      if (labelB !== labelA) {
        return labelA - labelB;
      }
      return endA - endB;
    });

    return new this(concatenated);
  }
}
