import { createInterface, Interface } from "node:readline";
import { createReadStream, ReadStream } from "node:fs";
import { Readable, Stream } from "node:stream";

// We re-export the Interface type from the readline module with a nicer name

export interface LineReader {
  [Symbol.asyncIterator](): AsyncIterableIterator<string>;
  close: () => void;
}

/**
 * `createLineReader` returns a line reader that will read from the file given by
 * `filename`. If the filename is "-", it will read from stdin.
 *
 * If the file does not exist an error will be thrown.
 */
export function createLineReader(filename: string): LineReader {
  let stream: Readable;
  if (filename === "-") {
    stream = process.stdin;
  } else {
    stream = createReadStream(filename);
  }

  return {
    close() {
      stream.destroy();
    },
    async *[Symbol.asyncIterator](): AsyncIterableIterator<string> {
      let buf = "";
      for await (const chunk of stream) {
        buf += chunk;
        let eolIndex;
        while ((eolIndex = buf.indexOf("\n")) >= 0) {
          yield buf.substring(0, eolIndex);
          buf = buf.substring(eolIndex + 1);
        }
      }

      if (buf.length > 0) {
        yield buf;
      }
    },
  };
}
