import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';

export default function TaskCard({ task, onComplete, onSkip }) {
  return (
    <div className="surface rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-sage-500">{task.taskType}</p>
          <h3 className="mt-1 font-bold">{task.topic}</h3>
          <p className="muted mt-1 text-sm">{task.subject} &rarr; {task.chapter} &rarr; {task.subtopic}</p>
        </div>
        <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-sage-700 dark:bg-sage-700/30 dark:text-sage-100">
          {task.difficultyLevel}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="muted inline-flex items-center gap-2 text-sm"><Clock size={16} /> {task.duration} min</span>
        <div className="flex gap-2">
          {onSkip && <button className="btn-ghost inline-flex items-center gap-2 text-sm" onClick={() => onSkip(task)}><RotateCcw size={16} /> Recover</button>}
          {onComplete && <button className="btn-primary inline-flex items-center gap-2 text-sm" onClick={() => onComplete(task)}><CheckCircle2 size={16} /> Complete</button>}
        </div>
      </div>
    </div>
  );
}
