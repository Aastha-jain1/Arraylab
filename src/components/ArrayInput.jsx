import { useEffect, useState } from 'react';
import { parseList } from '../utils.js';

export default function ArrayInput({ values, setValues }) {
  const [text, setText] = useState(values.join(', '));
  const [err, setErr] = useState('');

  // If another part of the app changes the array (random, sort, keep result), mirror it here.
  useEffect(() => {
    if (JSON.stringify(parseList(text) || []) !== JSON.stringify(values)) { setText(values.join(', ')); setErr(''); }
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  const edit = (t) => {
    setText(t);
    if (!t.trim()) { setValues([]); setErr(''); return; }
    const p = parseList(t);
    if (p) { setValues(p); setErr(''); } else setErr('Use up to 12 whole numbers separated by commas.');
  };
  const random = () => setValues(Array.from({ length: 7 }, () => 1 + Math.floor(Math.random() * 99)));

  return (
    <section className="panel bench">
      <label className="field grow"><span>Lab array (shared by every experiment)</span>
        <input value={text} onChange={(e) => edit(e.target.value)} spellCheck={false} />
      </label>
      <button onClick={random}>Random</button>
      <button onClick={() => setValues([...values].sort((a, b) => a - b))}>Sort ascending</button>
      {err && <p className="err">{err}</p>}
    </section>
  );
}
