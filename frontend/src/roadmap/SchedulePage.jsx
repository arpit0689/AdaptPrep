import { CheckCircle2, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import LoadingState from '../components/LoadingState';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';

const iso = (date) => date.toISOString().slice(0, 10);
const today = new Date();

export default function SchedulePage() {
  const [date, setDate] = useState(iso(today));
  const [refresh, setRefresh] = useState(0);
  const { data, loading } = useApi(() => api.get(`/tasks?date=${date}&limit=80`), [date, refresh]);

  const summary = useMemo(() => {
    const tasks = data?.tasks || [];
    return {
      completed: tasks.filter((task) => task.completed).length,
      minutes: tasks.reduce((sum, task) => sum + task.duration, 0),
      revisions: tasks.filter((task) => task.taskType === 'Revision').length,
      subjects: new Set(tasks.map((task) => task.subject)).size
    };
  }, [data]);

  const complete = async (task) => {
    await api.patch(`/tasks/${task._id}/complete`, { studyMinutesLogged: task.duration });
    setRefresh((value) => value + 1);
  };

  if (loading) return <LoadingState label="Opening your daily schedule..." />;

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-4xl font-black">Schedule</h1>
      <p className="muted mt-2">View and manage your daily topic-wise study schedule.</p>
      <section className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.6fr]">
        <div className="surface rounded-2xl p-5">
          <h2 className="text-2xl font-black">Select Date</h2>
          <input className="calm-input mt-5" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, index) => {
              const day = new Date(today);
              day.setDate(today.getDate() - today.getDay() + index);
              const selected = iso(day) === date;
              return <button key={iso(day)} className={`aspect-square rounded-xl font-bold ${selected ? 'bg-sage-500 text-white' : 'bg-sage-100/60 dark:bg-white/5'}`} onClick={() => setDate(iso(day))}>{day.getDate()}</button>;
            })}
          </div>
        </div>
        <div className="space-y-5">
          <div className="surface flex flex-col justify-between gap-3 rounded-2xl p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
              <p className="muted">{data.tasks.length} tasks scheduled - {Math.round(summary.minutes / 60)} hours planned</p>
            </div>
            <span className="rounded-full bg-sage-100 px-4 py-2 font-bold text-sage-700 dark:bg-sage-700/30 dark:text-sage-100">{summary.completed}/{data.tasks.length} completed</span>
          </div>
          <div className="surface rounded-2xl p-5">
            <h2 className="text-2xl font-black">Tasks</h2>
            <div className="mt-5 space-y-3">
              {data.tasks.map((task, index) => (
                <button key={task._id} className="flex w-full items-center gap-4 rounded-2xl border border-[var(--line)] p-4 text-left" onClick={() => complete(task)}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-100 font-bold text-sage-700 dark:bg-white/10 dark:text-sage-100">{index + 1}</span>
                  <CheckCircle2 className={task.completed ? 'text-sage-500' : 'muted'} />
                  <div>
                    <h3 className="font-black">{task.taskType}: {task.topic}</h3>
                    <p className="muted text-sm">{task.subject} &rarr; {task.chapter} <Clock className="ml-2 inline" size={14} /> {task.duration} min</p>
                  </div>
                  <span className="ml-auto rounded-full border border-[var(--line)] px-3 py-1 text-sm">{task.completed ? 'Completed' : 'Pending'}</span>
                </button>
              ))}
              {!data.tasks.length && <p className="muted rounded-xl bg-sage-100/60 p-4 dark:bg-white/5">No tasks scheduled. This can be a recovery or reflection day.</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat label="Study Time" value={`${Math.floor(summary.minutes / 60)}h ${summary.minutes % 60}m`} />
            <MiniStat label="Revisions" value={summary.revisions} />
            <MiniStat label="Subjects" value={summary.subjects} />
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }) {
  return <div className="surface rounded-2xl p-5"><p className="muted">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>;
}
