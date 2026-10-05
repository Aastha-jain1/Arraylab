import test from 'node:test';
import assert from 'node:assert/strict';
import { addressSteps } from './addressCalc.js';
import { insertSteps, deleteSteps } from './arrayOps.js';
import { linearSteps, binarySteps, isSorted } from './search.js';
const last = (s) => s[s.length - 1];

test('address: 0-based, 1-based, out of range', () => {
  const v = [10, 20, 30, 40];
  assert.match(last(addressSteps({ values: v, base: 1000, size: 4, lb: 0, target: 3 })).text, /1012/);
  assert.match(last(addressSteps({ values: v, base: 1000, size: 4, lb: 1, target: 3 })).text, /1008/);
  assert.ok(addressSteps({ values: v, base: 1000, size: 4, lb: 0, target: 4 })[0].error);
  assert.ok(addressSteps({ values: [], base: 0, size: 4, lb: 0, target: 0 })[0].error);
});

test('insert: beginning, middle, end, empty array', () => {
  let r = last(insertSteps([1, 2, 3], 5, 0, 9));
  assert.deepEqual(r.result, [9, 1, 2, 3]); assert.equal(r.stats.Shifts, 3);
  r = last(insertSteps([1, 2, 3], 5, 1, 9));
  assert.deepEqual(r.result, [1, 9, 2, 3]); assert.equal(r.stats.Shifts, 2);
  r = last(insertSteps([1, 2, 3], 5, 3, 9));
  assert.deepEqual(r.result, [1, 2, 3, 9]); assert.equal(r.stats.Shifts, 0);
  assert.deepEqual(last(insertSteps([], 3, 0, 7)).result, [7]);
});

test('insert: overflow and invalid index are errors; snapshots do not alias', () => {
  assert.ok(last(insertSteps([1, 2], 2, 0, 9)).error);
  assert.ok(insertSteps([1, 2], 5, 3, 9)[0].error);
  const S = insertSteps([1, 2, 3], 5, 0, 9);
  assert.notEqual(S[0].cells, S[1].cells);
  assert.deepEqual(S[0].cells, [1, 2, 3, null, null]);
});

test('delete by index', () => {
  let r = last(deleteSteps([1, 2, 3, 4], 'index', 0));
  assert.deepEqual(r.result, [2, 3, 4]); assert.equal(r.stats.Shifts, 3);
  r = last(deleteSteps([1, 2, 3, 4], 'index', 3));
  assert.deepEqual(r.result, [1, 2, 3]); assert.equal(r.stats.Shifts, 0);
  assert.deepEqual(last(deleteSteps([5], 'index', 0)).result, []);
  assert.ok(deleteSteps([1], 'index', 1)[0].error);
  assert.ok(deleteSteps([], 'index', 0)[0].error);
});

test('delete by value (first match, not found)', () => {
  const r = last(deleteSteps([4, 7, 7, 9], 'value', 7));
  assert.deepEqual(r.result, [4, 7, 9]); assert.equal(r.stats.Comparisons, 2);
  assert.ok(last(deleteSteps([1, 2], 'value', 5)).error);
  assert.ok(last(deleteSteps([], 'value', 5)).error);
});

test('linear search', () => {
  assert.equal(last(linearSteps([5, 3, 8], 3)).stats.Result, 'Found at index 1');
  assert.equal(last(linearSteps([5, 3, 8], 4)).stats.Comparisons, 3);
  assert.equal(last(linearSteps([], 4)).stats.Result, 'Not found');
});

test('binary search matches linear search and respects the log2 bound', () => {
  let seed = 7; const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let k = 0; k < 200; k++) {
    const n = Math.floor(rnd() * 20);
    const a = Array.from({ length: n }, () => Math.floor(rnd() * 30)).sort((x, y) => x - y);
    const t = Math.floor(rnd() * 30);
    const b = last(binarySteps(a, t)).stats;
    assert.equal(b.Result.startsWith('Found'), a.includes(t));
    if (b.Result.startsWith('Found')) assert.equal(a[Number(b.Result.split(' ').pop())], t);
    assert.ok(b.Comparisons <= Math.floor(Math.log2(n || 1)) + 1);
  }
  assert.ok(isSorted([1, 2, 2, 3]) && !isSorted([2, 1]));
});
