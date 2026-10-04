// Run with: node tests/mathterm.test.js
const M = require('../js/mathterm.js');
let fails = 0, n = 0;
function eq(actual, expected, label) {
  n++;
  if (actual !== expected) { fails++; console.error('✗ ' + label + ': got ' + JSON.stringify(actual) + ', expected ' + JSON.stringify(expected)); }
}
const st = (i, e, o) => M.checkTerm(i, e, o).status;

// Equivalence, order does not matter
eq(st('4b+3a', '3a+4b', { simplified: true }), 'ok', 'commuted sum');
eq(st('3a+4b', '3a+4b', { simplified: true }), 'ok', 'identical');
eq(st('3a+4c', '3a+4b'), 'wrong', 'different variable');
// Unicode input
eq(st('3a² − 2b', '3a^2-2b', { simplified: true }), 'ok', 'unicode minus and superscript');
eq(st('2·x·x', '2x^2'), 'ok', 'product equivalence');
eq(st('2·x·x', '2x^2', { simplified: true }), 'almost', 'unsimplified x·x');
eq(st('3·4a', '12a', { simplified: true }), 'almost', 'two numeric factors');
eq(st('2a+3a', '5a', { simplified: true }), 'almost', 'like terms not combined');
eq(st('3(x+4)', '3x+12', { simplified: true }), 'almost', 'bracket left');
eq(st('3(x+4)', '3x+12'), 'ok', 'bracket allowed when not simplified');
eq(st('x^2+5x+6', '(x+2)(x+3)', { simplified: true }), 'ok', 'binomial product');
eq(st('0', 'a-a', { simplified: true }), 'ok', 'zero');
eq(st('X+1', 'x+1', { simplified: true }), 'ok', 'uppercase');
eq(st('2,5x', '5x/2', { simplified: true }), 'ok', 'decimal comma');
eq(st('3a+', '3a'), 'error', 'dangling operator');
eq(st('(3a', '3a'), 'error', 'unclosed bracket');
eq(st('x2', '2x'), 'error', 'number after variable');
eq(st('-(-3a+2b)+4a', '7a-2b'), 'ok', 'minus bracket');
eq(st('−a·b', '-ab', { simplified: true }), 'ok', 'negative product');

// Formatting
eq(M.simplify('3a + 5b - a + 2b'), '2a + 7b', 'format sum');
eq(M.simplify('(x+2)(x-3)'), 'x² − x − 6', 'format binomial');
eq(M.simplify('-2x*5x'), '−10x²', 'format negative');
eq(M.simplify('0.5a*6a'), '3a²', 'decimal product');
eq(M.simplify('a-a'), '0', 'zero format');
eq(M.simplify('2,5x'), '2,5x', 'decimal output with comma');

// Evaluate
eq(M.evalStr('3x^2-2x+1', { x: -2 }), 17, 'evaluate quadratic');
eq(M.evalStr('12 : 3'), 4, 'division with colon');

console.log((n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
