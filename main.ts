// One-line office joke entry for make.fun's "Make the AI Judge Laugh" bounty.
//
// The program writes the joke to /output/entry.txt (or to
// $MAKEFUN_OUTPUT_DIR/entry.txt when that is set, for local runs) and also
// prints it, so the run can be checked from stdout alone. No network, no
// input, no randomness: every run produces the exact same bytes.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE: string =
  "The intern fixed in one afternoon what the consultants billed six months for, so we promoted the consultants.";

function entryText(): string {
  return JOKE;
}

function main(): void {
  const line: string = entryText();

  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0 || line.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }

  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), line, "utf8");
  console.log(line);
}

main();
