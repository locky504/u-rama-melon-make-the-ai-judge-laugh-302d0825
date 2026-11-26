// One-line office joke entry for make.fun's "Make the AI Judge Laugh" bounty.
//
// The program writes the joke to /output/entry.txt (or to
// $MAKEFUN_OUTPUT_DIR/entry.txt when that is set, for local runs) and also
// prints it, so the run can be checked from stdout alone. No network, no
// input, no randomness: every run produces the exact same bytes.
//
// Layout: the joke lives in JOKE, validateEntry() enforces the bounty's
// one-line shape, resolveOutputDir() picks the destination, and writeEntry()
// persists the line and verifies the bytes on disk before reporting success.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

// The entry itself. Kept as a single literal so the exact text (including
// its 109 characters) is easy to audit against the bounty requirements.
const JOKE: string =
  "The intern fixed in one afternoon what the consultants billed six months for, so we promoted the consultants.";

const MAX_ENTRY_CHARS = 200;
const OUTPUT_FILE = "entry.txt";

/**
 * Reject anything that is not a single non-blank line within the length
 * budget. Throws a descriptive Error naming the rule that failed.
 */
function validateEntry(line: string): void {
  if (line.length < 1 || line.length > MAX_ENTRY_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_ENTRY_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line (no line breaks)");
  }
}

/**
 * Pick the output directory: $MAKEFUN_OUTPUT_DIR when set (must be a
 * non-empty absolute path), otherwise the bounty default /output.
 */
function resolveOutputDir(): string {
  const fromEnv: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv === undefined || fromEnv === "") {
    return "/output";
  }
  if (!isAbsolute(fromEnv)) {
    throw new Error(
      `MAKEFUN_OUTPUT_DIR must be an absolute path, got ${JSON.stringify(fromEnv)}`,
    );
  }
  return fromEnv;
}

/**
 * Write the entry and read it back to prove the bytes on disk are exactly
 * the line we intended to submit.
 */
function writeEntry(line: string, outDir: string): void {
  mkdirSync(outDir, { recursive: true });
  const outPath: string = join(outDir, OUTPUT_FILE);
  writeFileSync(outPath, line, "utf8");
  const onDisk: string = readFileSync(outPath, "utf8");
  if (onDisk !== line) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
}

function main(): void {
  const line: string = JOKE;
  validateEntry(line);
  const outDir: string = resolveOutputDir();
  writeEntry(line, outDir);
  console.log(line);
}

main();
