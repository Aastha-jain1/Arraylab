const list = (a) => a.filter((x) => x !== null);

// Insert val at idx in an array with fixed capacity. Every step is a full snapshot.
export function insertSteps(values, cap, idx, val) {
  const n = values.length;
  const a = [...values, ...Array(Math.max(cap - n, 0)).fill(null)];
  const S = [];
  let shifts = 0, size = n;
  const op = `Insert ${val} at index ${idx}`;
  const push = (text, hl = {}, more = {}) =>
    S.push({
      cells: [...a], hl, text, ...more,
      stats: { Operation: op, Shifts: shifts, Elements: `${size} of ${cap}`, ...(more.done && !more.error ? { Final: `[${more.result.join(', ')}]` } : {}) },
    });
  if (idx < 0 || idx > n) { push(`Index ${idx} is invalid. You can insert at 0 to ${n}.`, {}, { error: true }); return S; }
  if (n >= cap) { push(`Overflow! All ${cap} slots are used, so there is no room for ${val}. A fixed-size array cannot grow.`, {}, { error: true, done: true, result: list(a) }); return S; }
  push(`${op}. The array uses ${n} of ${cap} slots.`);
  push(idx === n
    ? `Index ${idx} is the first free slot, so nothing has to move.`
    : `Elements from index ${idx} onward must each move one place right. Start from the last element so nothing gets overwritten.`);
  for (let i = n - 1; i >= idx; i--) {
    a[i + 1] = a[i]; shifts++;
    push(`Shift ${a[i]} from index ${i} to index ${i + 1}. (shift ${shifts})`, { [i]: 'from', [i + 1]: 'toR' });
  }
  a[idx] = val; size++;
  push(`Slot ${idx} is free now. Write ${val} into it.`, { [idx]: 'new' });
  push(`Done in ${shifts} shift${shifts === 1 ? '' : 's'}. Final array: [${list(a).join(', ')}]`, { [idx]: 'found' }, { done: true, result: list(a) });
  return S;
}

// Delete by 'index' or by 'value' (first match). Elements to the right move left.
export function deleteSteps(values, mode, key) {
  const n = values.length;
  const a = [...values];
  const S = [];
  let shifts = 0, comps = 0, size = n;
  const op = mode === 'value' ? `Delete value ${key}` : `Delete index ${key}`;
  const push = (text, hl = {}, more = {}) =>
    S.push({
      cells: [...a], hl, text, ...more,
      stats: { Operation: op, ...(mode === 'value' ? { Comparisons: comps } : {}), Shifts: shifts, Elements: `${size} of ${n}`, ...(more.done && !more.error ? { Final: `[${more.result.join(', ')}]` } : {}) },
    });
  let idx = key;
  if (mode === 'value') {
    push(`Delete the first element equal to ${key}. First we have to find it.`);
    idx = -1;
    for (let i = 0; i < n; i++) {
      comps++;
      const hit = a[i] === key;
      push(`Is arr[${i}] = ${a[i]} equal to ${key}? ${hit ? 'Yes, found it.' : 'No.'}`, { [i]: hit ? 'found' : 'cmp' });
      if (hit) { idx = i; break; }
    }
    if (idx < 0) { push(`${key} is not in the array, so there is nothing to delete.`, {}, { error: true, done: true, result: [...values] }); return S; }
  } else if (idx < 0 || idx >= n) {
    push(`Index ${idx} is invalid. ${n ? `Pick 0 to ${n - 1}.` : 'The array is empty.'}`, {}, { error: true });
    return S;
  } else push(`Delete the element at index ${idx}.`);
  const removed = a[idx];
  a[idx] = null;
  push(`Remove ${removed} from index ${idx}. This leaves a gap.`, { [idx]: 'del' });
  for (let i = idx; i < n - 1; i++) {
    a[i] = a[i + 1]; a[i + 1] = null; shifts++;
    push(`Move ${a[i]} from index ${i + 1} left to index ${i} to fill the gap. (shift ${shifts})`, { [i + 1]: 'from', [i]: 'toL' });
  }
  size--;
  push(`Done in ${shifts} shift${shifts === 1 ? '' : 's'}. The last slot is now empty. Final array: [${list(a).join(', ')}]`, {}, { done: true, result: list(a) });
  return S;
}
