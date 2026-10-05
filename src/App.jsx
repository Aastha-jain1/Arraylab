import { useState } from 'react';
import ArrayInput from './components/ArrayInput.jsx';
import MemoryModule from './modules/MemoryModule.jsx';
import InsertModule from './modules/InsertModule.jsx';
import DeleteModule from './modules/DeleteModule.jsx';
import SearchModule from './modules/SearchModule.jsx';
import CompareModule from './modules/CompareModule.jsx';

const Linear = (p) => <SearchModule {...p} kind="linear" />;
const Binary = (p) => <SearchModule {...p} kind="binary" />;
const TABS = [
  ['memory', 'Memory & addresses', MemoryModule],
  ['insert', 'Insertion', InsertModule],
  ['delete', 'Deletion', DeleteModule],
  ['linear', 'Linear search', Linear],
  ['binary', 'Binary search', Binary],
  ['compare', 'Compare searches', CompareModule],
];

export default function App() {
  const [tab, setTab] = useState('memory');
  const [values, setValues] = useState([10, 20, 30, 40, 50, 60, 70]);
  const Module = TABS.find(([k]) => k === tab)[2];
  return (
    <div className="app">
      <header>
        <h1>ArrayLab</h1>
        <p>Run an experiment, then step through it. See where each element sits in memory and what every algorithm does to it.</p>
      </header>
      <nav>
        {TABS.map(([k, label]) => (
          <button key={k} className={k === tab ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </nav>
      <ArrayInput values={values} setValues={setValues} />
      <Module key={tab} values={values} setValues={setValues} />
    </div>
  );
}
