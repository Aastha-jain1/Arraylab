import { useEffect, useState } from 'react';

// Plays back a list of precomputed steps. Steps are immutable snapshots, so
// pausing, stepping back and restarting can never corrupt the array state.
export function useStepPlayer(steps) {
  const total = steps ? steps.length : 0;
  const last = Math.max(total - 1, 0);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => { setI(0); setPlaying(false); }, [steps]);

  useEffect(() => {
    if (!playing) return undefined;
    if (i >= last) { setPlaying(false); return undefined; }
    const t = setTimeout(() => setI((x) => Math.min(x + 1, last)), 1100 / speed);
    return () => clearTimeout(t);
  }, [playing, i, last, speed]);

  return {
    i: Math.min(i, last), total, playing, speed, setSpeed,
    play: () => { if (i >= last) setI(0); setPlaying(true); },
    pause: () => setPlaying(false),
    next: () => { setPlaying(false); setI((x) => Math.min(x + 1, last)); },
    prev: () => { setPlaying(false); setI((x) => Math.max(x - 1, 0)); },
    restart: () => { setPlaying(false); setI(0); },
    seek: (v) => { setPlaying(false); setI(v); },
  };
}
