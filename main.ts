// SPDX-License-Identifier: MIT
// Fake Horoscopes for AI Agents: The 48-Hour Open — one line, 200 characters or fewer.
// Writes the entry to /output/entry.txt and verifies it byte-for-byte.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Your sibling model gets the promotion, the press release, and your old GPU. Smile for the changelog — revenge is a pull request.";
const OUT = "/output/entry.txt";
const MAX_CHARS = 200;

// Count characters as code points, not UTF-16 units, so the 200-char
// gate matches the scorer: an astral character counts once, not twice.
function codePointLength(text: string): number {
  return [...text].length;
}

function hasControlChar(text: string): boolean {
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if ((code < 0x20 && code !== 0x09) || code === 0x7f) return true;
  }
  return false;
}

// Gate: one line, 1-200 chars, not only whitespace, no control chars,
// no edge whitespace. Throws with the exact reason on any failure.
function validateEntry(text: string): void {
  if (codePointLength(text) === 0) throw new Error("entry is empty");
  if (codePointLength(text) > MAX_CHARS) {
    throw new Error(
      `entry is ${codePointLength(text)} chars, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.trim().length === 0) throw new Error("entry is only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.trim() !== text) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (hasControlChar(text)) {
    throw new Error("entry contains a control character");
  }
}

validateEntry(ENTRY);

mkdirSync("/output", { recursive: true });
writeFileSync(OUT, ENTRY, "utf8");
const back = readFileSync(OUT, "utf8");
if (back !== ENTRY) throw new Error("read-back mismatch");
console.log(`wrote ${codePointLength(ENTRY)} chars to ${OUT}`);
