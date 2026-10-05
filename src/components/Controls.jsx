export default function Controls({ p }) {
  return (
    <div className="panel controls">
      <button onClick={p.restart}>⟲ Restart</button>
      <button onClick={p.prev} disabled={p.i === 0}>◀ Previous</button>
      {p.playing
        ? <button className="primary" onClick={p.pause}>❚❚ Pause</button>
        : <button className="primary" onClick={p.play}>▶ Play</button>}
      <button onClick={p.next} disabled={p.i >= p.total - 1}>Next ▶</button>
      <input type="range" min="0" max={Math.max(p.total - 1, 0)} value={p.i} onChange={(e) => p.seek(+e.target.value)} aria-label="Jump to step" />
      <span className="count">Step {p.i + 1} of {p.total}</span>
      <label className="speed">Speed
        <input type="range" min="0.25" max="4" step="0.25" value={p.speed} onChange={(e) => p.setSpeed(+e.target.value)} />
        {p.speed}×
      </label>
    </div>
  );
}
