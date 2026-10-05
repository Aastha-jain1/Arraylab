import { useMemo, useState } from 'react';
import Stage from '../components/Stage.jsx';
import Field from '../components/Field.jsx';
import { addressSteps } from '../algorithms/addressCalc.js';
import { COMPLEXITY } from '../algorithms/complexity.js';
import { toInt } from '../utils.js';

export default function MemoryModule({ values }) {
  const [base, setBase] = useState('1000');
  const [size, setSize] = useState('4');
  const [lb, setLb] = useState(0);
  const [target, setTarget] = useState('2');
  const b = toInt(base), s = toInt(size), t = toInt(target);
  const bad = b === null || b < 0 ? 'The base address must be a whole number, 0 or more.'
    : s === null || s < 1 ? 'The element size must be a whole number of bytes, 1 or more.'
    : t === null ? 'Enter a target index, or click a cell.' : null;
  const steps = useMemo(
    () => (bad ? [{ cells: values, hl: {}, error: true, text: bad }] : addressSteps({ values, base: b, size: s, lb, target: t })),
    [values, bad, b, s, lb, t],
  );
  return (
    <>
      <div className="panel form">
        <Field label="Base address"><input value={base} onChange={(e) => setBase(e.target.value)} /></Field>
        <Field label="Element size (bytes)"><input value={size} onChange={(e) => setSize(e.target.value)} /></Field>
        <Field label="Indexing">
          <select value={lb} onChange={(e) => setLb(+e.target.value)}>
            <option value={0}>0-based</option><option value={1}>1-based</option>
          </select>
        </Field>
        <Field label="Target index"><input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <p className="hint">Each cell shows its value, its index [i], and its simulated memory address. Click a cell to choose it.</p>
      </div>
      <Stage steps={steps} complexity={COMPLEXITY.memory} lb={lb} mem={bad ? null : { base: b, size: s }} onPick={(i) => setTarget(String(i + lb))} />
    </>
  );
}
