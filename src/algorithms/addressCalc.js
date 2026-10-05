// Address = Base + (Index - LB) * Size
export function addressSteps({ values, base, size, lb, target }) {
  const n = values.length;
  if (target < lb || target > lb + n - 1) {
    const range = n ? `${lb} to ${lb + n - 1}` : 'none (the array is empty)';
    return [{ cells: values, hl: {}, error: true, text: `Index ${target} is outside the array. Valid indexes: ${range}.` }];
  }
  const pos = target - lb;
  const addr = base + pos * size;
  const mk = (text, last = false) => ({
    cells: values,
    hl: { [pos]: last ? 'found' : 'cmp' },
    text,
    done: last,
    stats: { Base: base, 'Size (bytes)': size, Index: target, Address: last ? addr : '?' },
  });
  return [
    mk(`Goal: find where element ${values[pos]} (index ${target}) is stored. The rule is Address = Base + (Index − LB) × Size, where LB is the first index (${lb}).`),
    mk(`Put in the numbers: Address = ${base} + (${target} − ${lb}) × ${size}.`),
    mk(`Index − LB = ${target} − ${lb} = ${pos}. That is how many elements sit before it.`),
    mk(`${pos} elements × ${size} bytes each = ${pos * size} bytes to skip from the start of the array.`),
    mk(`Base + offset = ${base} + ${pos * size} = ${addr}. Element ${values[pos]} lives at address ${addr}.`, true),
  ];
}
