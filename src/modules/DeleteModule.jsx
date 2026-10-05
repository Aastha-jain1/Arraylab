import { useEffect, useState } from 'react';
import Stage from '../components/Stage.jsx';
import Field from '../components/Field.jsx';
import { deleteSteps } from '../algorithms/arrayOps.js';
import { COMPLEXITY } from '../algorithms/complexity.js';
import { toInt } from '../utils.js';

export default function DeleteModule({ values, setValues }) {
  const [mode, setMode] = useState('index');
  const [key, setKey] = useState('1');
  const [steps, setSteps] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setSteps(null); }, [values]);

  const run = () => {
    const k = toInt(key), n = values.length;
    if (k === null) return setErr('Enter a whole number.');
    if (mode === 'index' && (k < 0 || k >= n)) return setErr(n ? `The index must be between 0 and ${n - 1}.` : 'The array is empty.');
    setErr('');
    setSteps(deleteSteps(values, mode, k));
  };

  return (
    <>
      <div className="panel form">
        <Field label="Delete by">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="index">Index</option><option value="value">Value</option>
          </select>
        </Field>
        <Field label={mode === 'index' ? 'Index to delete' : 'Value to delete'}><input value={key} onChange={(e) => setKey(e.target.value)} /></Field>
        <button className="primary" onClick={run}>Run deletion</button>
        {err && <span className="err">{err}</span>}
      </div>
      <Stage steps={steps} complexity={COMPLEXITY.delete} onKeep={setValues} />
    </>
  );
}
