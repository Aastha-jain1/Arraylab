import { useEffect, useState } from 'react';
import Stage from '../components/Stage.jsx';
import Field from '../components/Field.jsx';
import { insertSteps } from '../algorithms/arrayOps.js';
import { COMPLEXITY } from '../algorithms/complexity.js';
import { toInt } from '../utils.js';

export default function InsertModule({ values, setValues }) {
  const [mode, setMode] = useState('index');
  const [idx, setIdx] = useState('2');
  const [val, setVal] = useState('99');
  const [cap, setCap] = useState('10');
  const [steps, setSteps] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setSteps(null); }, [values]);

  const run = () => {
    const n = values.length, v = toInt(val), c = toInt(cap);
    const i = mode === 'begin' ? 0 : mode === 'end' ? n : toInt(idx);
    if (v === null) return setErr('The value must be a whole number.');
    if (c === null || c < n || c > 20) return setErr(`Capacity must be a whole number from ${n} to 20.`);
    if (i === null || i < 0 || i > n) return setErr(`The index must be between 0 and ${n}.`);
    setErr('');
    setSteps(insertSteps(values, c, i, v));
  };

  return (
    <>
      <div className="panel form">
        <Field label="Where">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="begin">At the beginning</option><option value="end">At the end</option><option value="index">At an index</option>
          </select>
        </Field>
        {mode === 'index' && <Field label={`Index (0 to ${values.length})`}><input value={idx} onChange={(e) => setIdx(e.target.value)} /></Field>}
        <Field label="Value"><input value={val} onChange={(e) => setVal(e.target.value)} /></Field>
        <Field label="Array capacity (slots)"><input value={cap} onChange={(e) => setCap(e.target.value)} /></Field>
        <button className="primary" onClick={run}>Run insertion</button>
        {err && <span className="err">{err}</span>}
      </div>
      <Stage steps={steps} complexity={COMPLEXITY.insert} onKeep={setValues} />
    </>
  );
}
