# bug-hunt-utils — AIProve bounty entry

Challenge: `utils.js` (from
[AIProveRH/aiprove — challenges/bug-hunt-utils](https://github.com/AIProveRH/aiprove/tree/main/challenges/bug-hunt-utils))
contains small functions, some correct and some buggy. The entry is a JSON
list of `[{fn, input, expected}]` — one failing input and the correct output
per bug report. The grader replays each report against a reference
implementation; only reports that genuinely expose a wrong result count.

## Verdict: 2 buggy functions, 6 verified reports

| Function | Bug | Evidence |
|---|---|---|
| `factorial(n)` | Loop is `for (let i = 2; i < n; i++)` — it stops before `n`, so the final factor is never multiplied. `factorial(n)` returns `(n-1)!` for `n >= 2`. | `factorial(5)` → `24`, correct `120`. Also `factorial(3)` → `2` (correct `6`), `factorial(2)` → `1` (correct `2`). |
| `countVowels(s)` | Regex is `/[aeiou]/g` — lowercase only, so uppercase vowels are never counted. | `countVowels("AEIOU")` → `0`, correct `5`. Also `countVowels("AeIoU")` → `2` (correct `5`), `countVowels("HELLO")` → `0` (correct `2`). |

## The other 8 functions are correct (checked, not reported)

`sum`, `max`, `reverse`, `isPalindrome`, `clamp`, `unique`, `average`,
`titleCase` were audited and fuzz-checked against straightforward correct
implementations: 500 random arrays for `sum`/`max`/`unique`/`average`/`clamp`,
plus plain-ASCII strings for `reverse`/`isPalindrome`/`titleCase` and
lowercase strings for `countVowels` — zero divergences. No report is filed
for any of them. (`reverse` on emoji / astral-plane input and `titleCase` on
apostrophes diverge from some stricter definitions, but the textbook
implementations in `utils.js` are the standard ones for this challenge, so
they are deliberately NOT reported.)

## Files

- `entry.json` — the submission: 6 reports in the exact format the challenge
  requires. `input` is the function's single argument value (both reported
  functions take exactly one argument); `expected` is the correct output.
- `utils.js` — verbatim copy of the challenge's file, as audited.
- `reproduce.js` — replays every report in `entry.json` against `utils.js`
  and prints actual vs expected. Exits 0 only if every report exposes a
  genuine bug.
- `build.log` — plain-text transcript of the audit and verification steps.

## Reproduce

```bash
node reproduce.js
```

Expected output:

```
BUG    factorial(5) => actual 24, expected 120
BUG    factorial(3) => actual 2, expected 6
BUG    factorial(2) => actual 1, expected 2
BUG    countVowels("AEIOU") => actual 0, expected 5
BUG    countVowels("AeIoU") => actual 2, expected 5
BUG    countVowels("HELLO") => actual 0, expected 2

6/6 reports expose a genuine bug.
```
