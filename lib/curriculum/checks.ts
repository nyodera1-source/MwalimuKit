/**
 * Pure validators for seeded curriculum data.
 *
 * Kept separate from scripts/audit-curriculum.ts so the detection logic can be
 * unit tested. An audit that reports "no findings" is only meaningful if the
 * checks are proven to fire — otherwise a silent pass and a clean dataset are
 * indistinguishable.
 *
 * The ranges are built from char codes rather than written as regex literals.
 * Literal C1 control bytes are stripped or normalised by editors and build
 * steps, which silently turns the intended pattern into something that matches
 * the wrong text — the failure mode this module exists to catch.
 */

const ch = String.fromCharCode;

/** C1 control characters: the signature of a corrupted encoding round-trip. */
export const C1_CONTROL = new RegExp(
  `[${ch(0x80)}-${ch(0x9f)}]`
);

/** U+FFFD REPLACEMENT CHARACTER, produced when lossy bytes are decoded. */
export const REPLACEMENT_CHAR = new RegExp(ch(0xfffd));

/** C0 controls other than tab, newline and carriage return, plus DEL. */
export const BAD_CONTROL = new RegExp(
  `[${ch(0x00)}-${ch(0x08)}${ch(0x0b)}${ch(0x0c)}${ch(0x0e)}-${ch(0x1f)}${ch(0x7f)}]`
);

export type EncodingIssueCode =
  | "encoding.c1-control"
  | "encoding.replacement-char"
  | "encoding.control-char";

export interface EncodingIssue {
  code: EncodingIssueCode;
  detail: string;
}

/**
 * Returns encoding problems in a single string value.
 *
 * Ordinary accented text, symbols and mathematical notation are legitimate
 * curriculum content and must not be flagged — the seeded data contains a
 * multiplication sign (U+00D7) and a Greek rho (U+03C1), both correct. Treating
 * non-ASCII as corruption would invite "fixes" that damage good data.
 */
export function findEncodingIssues(value: string): EncodingIssue[] {
  const issues: EncodingIssue[] = [];

  if (C1_CONTROL.test(value)) {
    issues.push({
      code: "encoding.c1-control",
      detail: `contains C1 control characters (U+0080-U+009F): ${JSON.stringify(value)}`,
    });
  }
  if (REPLACEMENT_CHAR.test(value)) {
    issues.push({
      code: "encoding.replacement-char",
      detail: `contains U+FFFD replacement characters: ${JSON.stringify(value)}`,
    });
  }
  if (BAD_CONTROL.test(value)) {
    issues.push({
      code: "encoding.control-char",
      detail: `contains disallowed control characters: ${JSON.stringify(value)}`,
    });
  }

  return issues;
}

/** Valid curriculum text is non-empty once trimmed and free of encoding damage. */
export function isCleanText(value: string): boolean {
  return value.trim().length > 0 && findEncodingIssues(value).length === 0;
}
