// ── Implementation ────────────────────────────────────────────────────────────

// Baseline implementation (2 parameters) — overridden below
function calculate(a, b) {
  return a + b;
}

// Project requirement: add a condition parameter to determine addition or subtraction
// This overrides the baseline. Calling with 2 args → condition=undefined (falsy) → subtraction.
function calculate(a, b, condition) {
  return condition ? a + b : a - b;
}

// ── Test cases ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(label, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label} → expected ${expected}, got ${actual}`);
    failed++;
  }
}

console.log("\nRunning calculate() tests...\n");

// 2-parameter path — condition=undefined is falsy → always subtracts (a - b)
test("2-param: positive integers", calculate(10, 5), 5); // 10 - 5 = 5
test("2-param: zeros", calculate(0, 0), 0); // 0 - 0 = 0
test("2-param: negative numbers", calculate(-3, -7), 4); // -3 - (-7) = 4
test("2-param: mixed sign", calculate(-4, 9), -13); // -4 - 9 = -13
test("2-param: floats", calculate(1.5, 2.5), -1);

// 3-parameter path (condition = true → addition)
test("3-param true: basic addition", calculate(10, 5, true), 15);
test("3-param true: negative result", calculate(-10, 3, true), -7);

// 3-parameter path (condition = false → subtraction)
test("3-param false: basic subtract", calculate(10, 5, false), 5);
test("3-param false: negative result", calculate(3, 10, false), -7);
test("3-param false: both negative", calculate(-2, -8, false), 6);

// Summary
console.log(
  `\n${passed} passed, ${failed} failed out of ${passed + failed} tests\n`,
);
if (failed > 0) process.exit(1);
