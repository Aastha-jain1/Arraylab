import { useStepPlayer } from '../hooks/useStepPlayer.js';
import ArrayView from './ArrayView.jsx';
import Stats from './Stats.jsx';
import Controls from './Controls.jsx';
import Explanation from './Explanation.jsx';
import ComplexityPanel from './ComplexityPanel.jsx';

// The shared "experiment bench": visual + counters + playback + explanation + complexity.
export default function Stage({ steps, complexity, lb = 0, mem, onPick, onKeep }) {
  const p = useStepPlayer(steps);
  if (!steps) return <p className="hint panel">Set up the experiment above, then press Run.</p>;
  const s = steps[p.i];
  return (
    <>
      <section className="panel tray" style={{ '--dur': `${0.5 / p.speed}s` }}>
        <ArrayView step={s} lb={lb} mem={mem} onPick={onPick} />
        <Stats stats={s.stats} />
        {s.done && !s.error && s.result && onKeep && (
          <button className="keep" onClick={() => onKeep(s.result)}>Use this result as the lab array</button>
        )}
      </section>
      <Controls p={p} />
      <div className="split">
        <Explanation steps={steps} i={p.i} />
        <ComplexityPanel c={complexity} />
      </div>
    </>
  );
}
