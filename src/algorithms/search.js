export const isSorted = (a) => a.every((v, i) => !i || a[i - 1] <= v);

export function linearSteps(a, t) {
  const S = [];
  let c = 0, idx = '–', el = '–', res = 'Searching…';
  const push = (text, hl = {}, more = {}) =>
    S.push({ cells: a, hl, text, stats: { Target: t, 'Current index': idx, 'Current element': el, Comparisons: c, Result: res }, ...more });
  push(`Look for ${t} by checking the elements one at a time, from the left.`);
  for (let i = 0; i < a.length; i++) {
    c++; idx = i; el = a[i];
    const hit = a[i] === t;
    if (hit) res = `Found at index ${i}`;
    push(`Compare arr[${i}] = ${a[i]} with the target ${t}: ${hit ? 'they match!' : 'not equal, move on.'}`,
      { [i]: hit ? 'found' : 'cmp' }, { dim: Array.from({ length: i }, (_, k) => k), done: hit });
    if (hit) return S;
  }
  res = 'Not found';
  push(`Every element was checked (${c} comparison${c === 1 ? '' : 's'}) and ${t} never appeared. It is not in the array.`, {}, { done: true });
  return S;
}

export function binarySteps(a, t) {
  const S = [];
  let lo = 0, hi = a.length - 1, mid = '–', c = 0, res = 'Searching…';
  const out = () => a.map((_, i) => i).filter((i) => i < lo || i > hi);
  const push = (text, hl = {}, more = {}) =>
    S.push({
      cells: a, hl, text, dim: out(),
      ptr: { low: lo, mid: typeof mid === 'number' ? mid : -1, high: hi },
      stats: { Target: t, Low: lo, Mid: mid, High: hi, Comparisons: c, Result: res }, ...more,
    });
  push(`The array is sorted, so every comparison can throw away half of it. Start with low = ${lo} and high = ${hi}.`);
  while (lo <= hi) {
    mid = Math.floor((lo + hi) / 2);
    push(`mid = ⌊(${lo} + ${hi}) / 2⌋ = ${mid} because low = ${lo} and high = ${hi}.`, { [mid]: 'mid' });
    c++;
    if (a[mid] === t) {
      res = `Found at index ${mid}`;
      push(`Compare arr[${mid}] = ${a[mid]} with the target ${t}: they match! The target is at index ${mid}.`, { [mid]: 'found' }, { done: true });
      return S;
    }
    if (a[mid] < t) {
      lo = mid + 1;
      push(`Compare arr[${mid}] = ${a[mid]} with ${t}: the middle is smaller, so the target can only be on the right. Ignore the left half (low = ${lo}).`, { [mid]: 'cmp' });
    } else {
      hi = mid - 1;
      push(`Compare arr[${mid}] = ${a[mid]} with ${t}: the middle is larger, so the target can only be on the left. Ignore the right half (high = ${hi}).`, { [mid]: 'cmp' });
    }
  }
  res = 'Not found';
  push(`low (${lo}) is now greater than high (${hi}), so nothing is left to search. ${t} is not in the array.`, {}, { done: true });
  return S;
}
