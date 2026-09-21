/**
 * Run oxlint, oxfmt, and TypeScript check for staged changes.
 * `tsc` runs once for the project when any TS/TSX file is staged.
 */
export default {
  "*.{js,jsx,mjs,cjs}": ["oxlint --fix --deny-warnings", "oxfmt"],
  "*.{ts,tsx}": ["oxlint --fix --deny-warnings", "oxfmt", () => "npx tsc --noEmit"],
  "*.{json,md,yml,yaml}": ["oxfmt --no-error-on-unmatched-pattern"],
};
