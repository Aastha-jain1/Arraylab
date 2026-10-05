export default function Explanation({ steps, i, title = 'What is happening' }) {
  const cur = steps[i];
  const past = steps.slice(0, i).map((s, k) => ({ s, k })).reverse();
  return (
    <section className="panel">
      <h3>{title}</h3>
      <p className={`now${cur.error ? ' err' : ''}`}>{cur.text}</p>
      {past.length > 0 && (
        <ul className="log">{past.map(({ s, k }) => <li key={k}><b>{k + 1}.</b> {s.text}</li>)}</ul>
      )}
    </section>
  );
}
