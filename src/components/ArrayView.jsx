// Draws one step snapshot: pointer tags, cells, index labels and (optionally) memory addresses.
export default function ArrayView({ step, lb = 0, mem, onPick }) {
  const { cells, hl = {}, ptr = {}, dim = [] } = step;
  if (!cells.length) return <p className="hint">The array is empty. Type some numbers into the lab array box.</p>;
  return (
    <div className="array-scroll">
      <div className="array">
        {cells.map((v, i) => {
          const tags = Object.entries(ptr).filter(([, x]) => x === i).map(([k]) => k);
          const cls = ['cell', v === null && 'empty', hl[i], dim.includes(i) && 'dim', onPick && 'pick'].filter(Boolean).join(' ');
          return (
            <div className="slot" key={i}>
              <div className="ptrs">{tags.map((t) => <span key={t} className={`ptr ${t}`}>{t}</span>)}</div>
              <div key={`${v}-${hl[i]}`} className={cls} onClick={onPick ? () => onPick(i) : undefined}>{v === null ? '' : v}</div>
              <div className="idx">[{i + lb}]</div>
              {mem && <div className="addr">{mem.base + i * mem.size}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
