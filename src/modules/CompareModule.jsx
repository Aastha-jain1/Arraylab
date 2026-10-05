import { useEffect, useState } from 'react';
import { useStepPlayer } from '../hooks/useStepPlayer.js';
import ArrayView from '../components/ArrayView.jsx';
import Stats from '../components/Stats.jsx';
import Controls from '../components/Controls.jsx';
import Field from '../components/Field.jsx';
import SortWarning from '../components/SortWarning.jsx';
import { linearSteps, binarySteps, isSorted } from '../algorithms/search.js';
import { COMPLEXITY } from '../algorithms/complexity.js';
import { toInt } from '../utils.js';

// Both searches run side by side, one step per tick, on the same array and target.
export default function CompareModule({ values, setValues }) {
  const [target, setTarget] = useState('40');
  const [run, setRun] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setRun(null); }, [values]);
  const p = useStepPlayer(run && run.frames);
  const blocked = !isSorted(values);

  const go = () => {
    const t = toInt(target);
    if (t === null) return setErr('The target must be a whole number.');
    setErr('');
    const lin = linearSteps(values, t), bin = binarySteps(values, t);
    setRun({ lin, bin, frames: Array.from({ length: Math.max(lin.length, bin.length) }) });
  };

  const panels = run && [['Linear search', run.lin, COMPLEXITY.linear], ['Binary search', run.bin, COMPLEXITY.binary]];
  const lc = run && run.lin[run.lin.length - 1].stats.Comparisons;
  const bc = run && run.bin[run.bin.length - 1].stats.Comparisons;

  return (
    <>
      {blocked && <SortWarning values={values} setValues={setValues} />}
      <div className="panel form">
        <Field label="Target"><input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <button className="primary" onClick={go} disabled={blocked}>Run both searches</button>
        {err && <span className="err">{err}</span>}
      </div>
      {!run && <p className="hint panel">Both algorithms will search the same array for the same target, one step at a time.</p>}
      {run && (
        <>
          {panels.map(([name, st]) => {
            const s = st[Math.min(p.i, st.length - 1)];
            return (
              <section className="panel tray" key={name} style={{ '--dur': `${0.5 / p.speed}s` }}>
                <h3>{name}</h3>
                <ArrayView step={s} />
                <Stats stats={s.stats} />
                <p className="now">{s.text}</p>
              </section>
            );
          })}
          <Controls p={p} />
          <section className="panel">
            <h3>Result</h3>
            <table className="cmp">
              <thead><tr><th>Algorithm</th><th>Comparisons</th><th>Steps</th><th>Worst-case time</th><th>Outcome</th></tr></thead>
              <tbody>
                {panels.map(([name, st, c]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{st[st.length - 1].stats.Comparisons}</td>
                    <td>{st.length}</td>
                    <td>{c.worst}</td>
                    <td>{st[st.length - 1].stats.Result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="verdict">
              {lc === bc
                ? `Tie: both used ${lc} comparison${lc === 1 ? '' : 's'}. On small arrays or lucky targets the two are close.`
                : `${bc < lc ? 'Binary' : 'Linear'} search did better here: ${Math.min(lc, bc)} comparisons against ${Math.max(lc, bc)}.`}
            </p>
            <p className="note">Binary search wins more clearly as the array grows, because it needs about log₂(n) comparisons while linear search may need n. Try the target at index 0 to see linear search win.</p>
          </section>
        </>
      )}
    </>
  );
}
