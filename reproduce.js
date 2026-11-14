// Reproducer for AIProve bounty "bug-hunt-utils".
// Loads the challenge's utils.js, replays every report in entry.json,
// and prints actual vs expected for each. A report is a genuine bug only
// if actual !== expected. Exits 0 only if EVERY report exposes a real bug;
// exits 1 otherwise (a report that matches the reference is not a bug).
//
// Usage: node reproduce.js
// Input convention: each report's "input" is the function's single argument
// value (both reported functions take exactly one argument), and "expected"
// is the correct output for that input.

const utils = require("./utils.js");
const reports = require("./entry.json");

let genuine = 0;
for (const { fn, input, expected } of reports) {
  if (typeof utils[fn] !== "function") {
    console.log(`FAIL  ${fn}: no such function in utils.js`);
    continue;
  }
  const actual = utils[fn](input);
  const isBug = !Object.is(actual, expected);
  if (isBug) genuine++;
  console.log(
    `${isBug ? "BUG   " : "NOT-A-BUG"} ${fn}(${JSON.stringify(input)}) ` +
      `=> actual ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`
  );
}

console.log(`\n${genuine}/${reports.length} reports expose a genuine bug.`);
if (genuine !== reports.length) {
  console.error("ERROR: at least one report does not expose a bug.");
  process.exit(1);
}
