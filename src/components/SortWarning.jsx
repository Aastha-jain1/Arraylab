export default function SortWarning({ values, setValues }) {
  return (
    <div className="warn panel">
      Binary search only works on a sorted array. Sort the lab array first.
      <button onClick={() => setValues([...values].sort((a, b) => a - b))}>Sort ascending</button>
    </div>
  );
}
