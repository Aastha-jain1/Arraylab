import { useEffect, useState } from 'react';
import Stage from '../components/Stage.jsx';
import Field from '../components/Field.jsx';
import SortWarning from '../components/SortWarning.jsx';
import { linearSteps, binarySteps, isSorted } from '../algorithms/search.js';
import { COMPLEXITY } from '../algorithms/complexity.js';
import { toInt } from '../utils.js';

export default function SearchModule({ values, setValues, kind }) {
  const [target, setTarget] = useState('40');
  const [steps, setSteps] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setSteps(null); }, [values]);
  const bin = kind === 'binary';
  const blocked = bin && !isSorted(values);

  const run = () => {
    const t = toInt(target);
    if (t === null) return setErr('The target must be a whole number.');
    setErr('');
    setSteps((bin ? binarySteps : linearSteps)(values, t));
  };

  return (
    <>
      {blocked && <SortWarning values={values} setValues={setValues} />}
      <div className="panel form">
        <Field label="Target"><input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <button className="primary" onClick={run} disabled={blocked}>Run {bin ? 'binary' : 'linear'} search</button>
        {err && <span className="err">{err}</span>}
      </div>
      <Stage steps={steps} complexity={COMPLEXITY[kind]} />
    </>
  );
}
