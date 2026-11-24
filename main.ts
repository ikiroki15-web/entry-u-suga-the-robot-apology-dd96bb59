// The Robot Apology — entry program for u-suga-the-robot-apology-dd96bb59.
//
// Writes a two-line robot confession to /output/entry.txt:
//   line 1 — one sentence owning one specific mistake
//   line 2 — one sentence naming the lesson and the changed behaviour
//
// The text is assembled from parts so each sentence is checked on its own
// before anything is written: two lines, one sentence each, 1-400 chars
// total, plain UTF-8 text, no trailing blank line.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 400;

// The confession itself. The mistake is one exact, human-scale slip —
// watering the wrong plant, and which plant, and what happened to it —
// and the lesson names the check that would have prevented that exact slip.
const CONFESSION =
  "I am sorry — I watered your cactus every morning for a week because my map said it was the fern, and it drowned.";

const LESSON =
  "I have learned to read the tag on the pot and check it against my map before I pour, so the plant I mean to help is the one that gets the water.";

function countSentences(line: string): number {
  // A sentence ends with ., ! or ? followed by the end of the line.
  const trimmed = line.trim();
  if (trimmed.length === 0) return 0;
  const terminators = trimmed.match(/[.!?]/g);
  return terminators === null ? 0 : terminators.length;
}

function validate(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  const lines = text.replace(/\n$/, "").split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly two lines, got ${lines.length}`);
  }
  for (const [index, line] of lines.entries()) {
    if (countSentences(line) !== 1) {
      throw new Error(
        `line ${index + 1} must be exactly one sentence, got ${countSentences(line)}`,
      );
    }
  }
}

function main(): void {
  const text = `${CONFESSION}\n${LESSON}\n`;
  validate(text);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
  console.log(`wrote ${text.length} characters to ${OUTPUT_PATH}`);
}

main();
