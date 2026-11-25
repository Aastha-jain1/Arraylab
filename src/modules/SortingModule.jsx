import { useMemo, useState } from 'react';
import { SORTS } from '../algorithms/sorting.js';

const formatTime = (ms) => ms < 1 ? `${(ms * 1000).toFixed(2)} μs` : `${ms.toFixed(3)} ms`;

export default function SortingModule({ values, setValues }) {
  const [algorithm, setAlgorithm] = useState(SORTS[0].id);
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState('');
  const selected = SORTS.find((sort) => sort.id === algorithm);
  const original = useMemo(() => [...values], [values]);

  const run = (sort) => {
    const input = [...original];
    const start = performance.now();
    const output = sort.run(input);
    const elapsed = performance.now() - start;
    return { output, elapsed };
  };
  const execute = () => {
    try { setError(''); setComparison(null); setResult(run(selected)); }
    catch (e) { setError(e.message || 'Could not sort this input.'); setResult(null); }
  };
  const compare = () => {
    try {
      setError(''); setResult(null);
      setComparison(SORTS.map((sort) => ({ sort, ...run(sort) })));
    } catch (e) { setError(e.message || 'Could not compare these algorithms.'); setComparison(null); }
  };
  const reset = () => { setValues([]); setResult(null); setComparison(null); setError(''); };
  const randomize = () => {
    setValues(Array.from({ length: 20 }, () => Math.floor(Math.random() * 201) - 100));
    setResult(null); setComparison(null); setError('');
  };

  return <>
    <section className="panel">
      <h3>Sort the shared array</h3>
      <div className="form">
        <label className="field">Algorithm
          <select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value); setResult(null); }}>
            {SORTS.map((sort) => <option key={sort.id} value={sort.id}>{sort.name}</option>)}
          </select>
        </label>
        <button className="primary" onClick={execute}>Sort array</button>
        <button onClick={compare}>Compare all 10</button>
        <button onClick={randomize}>Random array</button>
        <button onClick={reset}>Reset input</button>
        {!values.length && <p className="hint">Enter integers in the shared array above to begin.</p>}
        {error && <p className="err" role="alert">{error}</p>}
      </div>
    </section>
    <section className="panel">
      <h3>{selected.name}</h3>
      <p>{selected.explanation}</p>
      {selected.id === 'counting' && <p className="note">For predictable memory use, this implementation accepts a value range of at most 2,000,000.</p>}
      <table><thead><tr><th>Case</th><th>Time</th></tr></thead><tbody>
        <tr><td>Best</td><td>{selected.best}</td></tr><tr><td>Average</td><td>{selected.average}</td></tr><tr><td>Worst</td><td>{selected.worst}</td></tr>
        <tr><td>Space</td><td>{selected.space}</td></tr><tr><td>Stable</td><td>{selected.stable}</td></tr><tr><td>In-place</td><td>{selected.inPlace}</td></tr>
      </tbody></table>
    </section>
    {result && <section className="panel">
      <h3>Sort result</h3>
      <p><strong>Original:</strong> <code>{original.join(', ') || '(empty array)'}</code></p>
      <p><strong>Sorted:</strong> <code>{result.output.join(', ') || '(empty array)'}</code></p>
      <p className="note">Elapsed time: {formatTime(result.elapsed)}. Timings are approximate and hardware-dependent.</p>
    </section>}
    {comparison && <section className="panel">
      <h3>Algorithm comparison</h3>
      <div className="cmp"><table><thead><tr><th>Algorithm</th><th>Elapsed</th><th>Time complexity</th><th>Space</th><th>Stable</th><th>In-place</th></tr></thead>
        <tbody>{comparison.map(({ sort, elapsed }) => <tr key={sort.id}><td>{sort.name}</td><td>{formatTime(elapsed)}</td><td>{sort.average} avg / {sort.worst} worst</td><td>{sort.space}</td><td>{sort.stable}</td><td>{sort.inPlace}</td></tr>)}</tbody>
      </table></div>
      <p className="note">Each algorithm receives its own copy of the same original input. Execution timings are approximate and hardware-dependent; very small arrays may be below timer resolution.</p>
    </section>}
  </>;
}
