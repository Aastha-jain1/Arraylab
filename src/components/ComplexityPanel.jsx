export default function ComplexityPanel({ c }) {
  return (
    <section className="panel">
      <h3>Complexity</h3>
      <table>
        <tbody>
          <tr><th>Best case</th><td>{c.best}</td></tr>
          <tr><th>Average case</th><td>{c.avg}</td></tr>
          <tr><th>Worst case</th><td>{c.worst}</td></tr>
          <tr><th>Space</th><td>{c.space}</td></tr>
        </tbody>
      </table>
      <p className="note">{c.note}</p>
    </section>
  );
}
