import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = (next = minutes) => {
    setMinutes(next);
    setSecondsLeft(next * 60);
    setRunning(false);
  };

  const display = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <div className="surface rounded-2xl p-5">
      <h3 className="font-black">Focus Timer</h3>
      <div className="my-5 text-center text-5xl font-black">{display}</div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {[25, 50].map((value) => <button key={value} className={`btn-ghost ${minutes === value ? 'bg-sage-100 text-sage-700 dark:bg-sage-700/30 dark:text-sage-100' : ''}`} onClick={() => reset(value)}>{value} min</button>)}
      </div>
      <div className="flex gap-2">
        <button className="btn-primary flex-1" onClick={() => setRunning((value) => !value)}>{running ? <Pause className="mx-auto" /> : <Play className="mx-auto" />}</button>
        <button className="btn-ghost" onClick={() => reset()}><RotateCcw /></button>
      </div>
    </div>
  );
}
