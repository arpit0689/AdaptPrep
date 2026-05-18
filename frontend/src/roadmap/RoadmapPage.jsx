import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, RotateCcw, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import LoadingState from '../components/LoadingState';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';

const todayKey = () => new Date().toISOString().slice(0, 10);
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export default function RoadmapPage() {
  const [date, setDate] = useState(todayKey());
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const { data, loading } = useApi(() => api.get(`/tasks?date=${date}&limit=80`), [date, refresh]);
  const selected = new Date(date);
  const week = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(selected, index - selected.getDay())), [date]);

  const complete = async (task) => {
    await api.patch(`/tasks/${task._id}/complete`, { studyMinutesLogged: task.duration });
    setRefresh((value) => value + 1);
  };

  const runRoadmapAction = async (action) => {
    setBusyAction(action);
    setMessage('');
    try {
      const endpoint = action === 'recover' ? '/tasks/recover' : '/tasks/regenerate';
      const { data: result } = await api.post(endpoint);
      setMessage(result.message);
      setRefresh((value) => value + 1);
    } catch (error) {
      setMessage(error.response?.data?.message || 'The roadmap action needs a moment. Please try again.');
    } finally {
      setBusyAction('');
    }
  };

  if (loading) return <LoadingState label="Loading topic-wise roadmap..." />;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black">Study Roadmap</h1>
          <p className="muted mt-2">Your personalized day-wise study schedule.</p>
        </div>
        <label className="surface flex items-center gap-3 rounded-2xl px-4 py-3">
          <CalendarDays className="text-sage-500" />
          <input className="bg-transparent outline-none" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-[#eaa09a] bg-[#fff6f4] p-5 text-[#a83e35] dark:bg-[#3b2824]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><AlertTriangle /><b>Let&apos;s rebalance your roadmap gradually</b></div>
          <button className="btn-ghost inline-flex items-center gap-2" disabled={busyAction === 'recover'} onClick={() => runRoadmapAction('recover')}>
            <RotateCcw size={18} /> {busyAction === 'recover' ? 'Recovering...' : 'Recover Tasks'}
          </button>
        </div>
      </div>
      {message && <div className="mt-3 rounded-xl bg-sage-100 p-3 text-sm font-bold text-sage-700 dark:bg-sage-700/30 dark:text-sage-100">{message}</div>}

      <section className="surface mt-6 flex flex-col gap-5 rounded-2xl p-5 lg:flex-row lg:items-center lg:justify-between">
        <Mini label="Days Until Exam" value="Adaptive" />
        <Mini label="Syllabus Progress" value="Topic-wise" />
        <Mini label="Tasks Completed" value={data.tasks.filter((task) => task.completed).length} />
        <div className="flex gap-2">
          <button className="btn-ghost" aria-label="Refresh" onClick={() => setRefresh((value) => value + 1)}><RotateCcw /></button>
          <button className="btn-primary inline-flex items-center gap-2" disabled={busyAction === 'regenerate'} onClick={() => runRoadmapAction('regenerate')}>
            <Wand2 size={18} /> {busyAction === 'regenerate' ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </section>

      <section className="surface mt-6 flex items-center justify-between rounded-2xl p-5">
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setDate(todayKey())}>Today</button>
          <button className="btn-ghost" aria-label="Previous week"><ChevronLeft /></button>
          <button className="btn-ghost" aria-label="Next week"><ChevronRight /></button>
        </div>
        <b>{week[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {week[6].toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</b>
        <div className="muted hidden gap-4 sm:flex"><span>Completed</span><span>Pending</span><span>Overdue</span></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {week.map((day) => {
          const key = day.toISOString().slice(0, 10);
          const isSelected = key === date;
          const tasks = isSelected ? data.tasks : [];
          return (
            <div key={key} className={`surface min-h-72 rounded-2xl p-4 ${isSelected ? 'ring-2 ring-sage-500' : ''}`}>
              <p className="muted text-sm">{day.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
              <h3 className="text-2xl font-black">{day.getDate()}</h3>
              <div className="mt-3 h-1 rounded-full bg-sage-100 dark:bg-white/10">
                <div className="h-full rounded-full bg-sage-500" style={{ width: `${tasks.length ? 35 : 0}%` }} />
              </div>
              <div className="mt-3 space-y-2">
                {tasks.length ? tasks.slice(0, 4).map((task) => (
                  <button key={task._id} onClick={() => complete(task)} className="w-full rounded-xl border-l-2 border-sage-500 bg-sage-100/60 p-2 text-left text-sm dark:bg-white/5">
                    <b className="block truncate">{task.taskType}: {task.topic}</b>
                    <span className="muted block truncate">{task.subject}</span>
                  </button>
                )) : <p className="muted mt-8 text-sm">No tasks scheduled</p>}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Mini({ label, value }) {
  return <div><p className="muted">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}
