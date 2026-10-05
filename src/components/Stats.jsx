export default function Stats({ stats }) {
  if (!stats) return null;
  return (
    <div className="stats">
      {Object.entries(stats).map(([k, v]) => <div key={k}><span>{k}</span><b>{String(v)}</b></div>)}
    </div>
  );
}
