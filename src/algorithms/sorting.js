const swap = (a, i, j) => { [a[i], a[j]] = [a[j], a[i]]; };
const validate = (values) => {
  if (!Array.isArray(values) || !values.every(Number.isSafeInteger)) throw new TypeError('Sorting input must contain only safe integers.');
};

export function bubbleSort(values) {
  validate(values); const a = [...values];
  for (let end = a.length - 1; end > 0; end--) {
    let changed = false;
    for (let i = 0; i < end; i++) if (a[i] > a[i + 1]) { swap(a, i, i + 1); changed = true; }
    if (!changed) break;
  }
  return a;
}
export function selectionSort(values) {
  validate(values); const a = [...values];
  for (let i = 0; i < a.length - 1; i++) {
    let min = i; for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
    if (min !== i) swap(a, i, min);
  }
  return a;
}
export function insertionSort(values) {
  validate(values); const a = [...values];
  for (let i = 1; i < a.length; i++) { const value = a[i]; let j = i - 1; while (j >= 0 && a[j] > value) { a[j + 1] = a[j]; j--; } a[j + 1] = value; }
  return a;
}
export function mergeSort(values) {
  validate(values);
  const sort = (a) => {
    if (a.length < 2) return a;
    const mid = Math.floor(a.length / 2), left = sort(a.slice(0, mid)), right = sort(a.slice(mid)), out = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) out.push(left[i] <= right[j] ? left[i++] : right[j++]);
    return out.concat(left.slice(i), right.slice(j));
  };
  return sort([...values]);
}
export function quickSort(values) {
  validate(values); const a = [...values];
  const sort = (lo, hi) => {
    while (lo < hi) {
      const pivot = a[Math.floor((lo + hi) / 2)]; let i = lo, j = hi;
      while (i <= j) { while (a[i] < pivot) i++; while (a[j] > pivot) j--; if (i <= j) { swap(a, i++, j--); } }
      // Recurse into the smaller partition to keep stack use bounded.
      if (j - lo < hi - i) { if (lo < j) sort(lo, j); lo = i; } else { if (i < hi) sort(i, hi); hi = j; }
    }
  };
  sort(0, a.length - 1); return a;
}
export function heapSort(values) {
  validate(values); const a = [...values], n = a.length;
  const sift = (root, size) => { while (2 * root + 1 < size) { let child = 2 * root + 1; if (child + 1 < size && a[child + 1] > a[child]) child++; if (a[root] >= a[child]) return; swap(a, root, child); root = child; } };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) sift(i, n);
  for (let end = n - 1; end > 0; end--) { swap(a, 0, end); sift(0, end); }
  return a;
}
export function countingSort(values) {
  validate(values); if (!values.length) return [];
  const min = Math.min(...values), max = Math.max(...values), range = max - min + 1;
  if (!Number.isSafeInteger(range) || range > 2_000_000) throw new RangeError('Counting sort supports a value range of at most 2,000,000.');
  const counts = new Array(range).fill(0); for (const value of values) counts[value - min]++;
  const out = []; for (let i = 0; i < counts.length; i++) while (counts[i]--) out.push(i + min);
  return out;
}
function radixNonNegative(values) {
  let a = [...values], max = 0;
  for (const value of a) if (value > max) max = value;
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const counts = new Array(10).fill(0), out = new Array(a.length);
    for (const value of a) counts[Math.floor(value / exp) % 10]++;
    for (let i = 1; i < 10; i++) counts[i] += counts[i - 1];
    for (let i = a.length - 1; i >= 0; i--) { const digit = Math.floor(a[i] / exp) % 10; out[--counts[digit]] = a[i]; }
    a = out;
    if (exp > Number.MAX_SAFE_INTEGER / 10) break;
  }
  return a;
}
export function radixSort(values) {
  validate(values);
  const negative = radixNonNegative(values.filter((v) => v < 0).map((v) => -v));
  const positive = radixNonNegative(values.filter((v) => v >= 0));
  return negative.reverse().map((v) => -v).concat(positive);
}
export function shellSort(values) {
  validate(values); const a = [...values];
  for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2))
    for (let i = gap; i < a.length; i++) { const value = a[i]; let j = i; while (j >= gap && a[j - gap] > value) { a[j] = a[j - gap]; j -= gap; } a[j] = value; }
  return a;
}
export function bucketSort(values) {
  validate(values); if (values.length < 2) return [...values];
  const min = Math.min(...values), max = Math.max(...values); if (min === max) return [...values];
  const count = Math.max(1, Math.ceil(Math.sqrt(values.length))), buckets = Array.from({ length: count }, () => []), range = max - min;
  for (const value of values) buckets[Math.min(count - 1, Math.floor(((value - min) / range) * count))].push(value);
  const out = []; for (const bucket of buckets) out.push(...insertionSort(bucket)); return out;
}

export const SORTS = [
  { id: 'bubble', name: 'Bubble Sort', run: bubbleSort, explanation: 'Repeatedly swaps adjacent out-of-order values; stops early if a pass makes no swaps.', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Stable', inPlace: 'Yes' },
  { id: 'selection', name: 'Selection Sort', run: selectionSort, explanation: 'Selects the smallest remaining value and places it at the next output position.', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Unstable', inPlace: 'Yes' },
  { id: 'insertion', name: 'Insertion Sort', run: insertionSort, explanation: 'Builds a sorted prefix by inserting each next value into its correct position.', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Stable', inPlace: 'Yes' },
  { id: 'merge', name: 'Merge Sort', run: mergeSort, explanation: 'Splits the input, sorts each half, then merges the sorted halves.', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Stable', inPlace: 'No' },
  { id: 'quick', name: 'Quick Sort', run: quickSort, explanation: 'Partitions values around a pivot and recursively sorts the partitions.', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: 'Unstable', inPlace: 'Yes' },
  { id: 'heap', name: 'Heap Sort', run: heapSort, explanation: 'Builds a max heap, then repeatedly moves its largest value to the end.', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: 'Unstable', inPlace: 'Yes' },
  { id: 'counting', name: 'Counting Sort', run: countingSort, explanation: 'Counts each integer in the value range and writes values back in order; supports negatives.', best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)', stable: 'Stable', inPlace: 'No' },
  { id: 'radix', name: 'Radix Sort', run: radixSort, explanation: 'Sorts by each decimal digit using stable counting passes; handles negative integers.', best: 'O(d(n + b))', average: 'O(d(n + b))', worst: 'O(d(n + b))', space: 'O(n + b)', stable: 'Stable', inPlace: 'No' },
  { id: 'shell', name: 'Shell Sort', run: shellSort, explanation: 'Uses progressively smaller gaps to move values closer to their final positions.', best: 'O(n log n)', average: 'O(n^1.5)', worst: 'O(n²)', space: 'O(1)', stable: 'Unstable', inPlace: 'Yes' },
  { id: 'bucket', name: 'Bucket Sort', run: bucketSort, explanation: 'Distributes values across buckets, sorts each bucket, then concatenates them.', best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)', space: 'O(n + k)', stable: 'Stable', inPlace: 'No' },
];
