import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import LoadingState from '../components/LoadingState';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';

export default function SubjectsPage() {
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState({});
  const { data, loading } = useApi(() => api.get('/progress'), [refresh]);

  const toggleTopic = async (topic) => {
    await api.patch(`/progress/${topic._id}`, { completed: !topic.completed });
    setRefresh((value) => value + 1);
  };

  if (loading) return <LoadingState label="Loading your syllabus map..." />;

  const total = data.topics.length;
  const completed = data.topics.filter((topic) => topic.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-4xl font-black">Subjects & Topics</h1>
      <p className="muted mt-2">Auto-generated syllabus hierarchy with topic completion and weak indicators.</p>
      <section className="surface mt-6 grid gap-6 rounded-2xl p-5 md:grid-cols-4">
        <Metric label="Total Subjects" value={data.subjects.length} />
        <Metric label="Total Topics" value={total} />
        <Metric label="Completed" value={completed} />
        <div>
          <p className="muted">Overall Progress</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-sage-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-sage-500" style={{ width: `${percent}%` }} />
            </div>
            <b>{percent}%</b>
          </div>
        </div>
      </section>
      <section className="mt-6 space-y-4">
        {data.subjects.map((subject) => {
          const subjectPercent = subject.total ? Math.round((subject.completed / subject.total) * 100) : 0;
          const isOpen = open[subject.subject] ?? true;
          return (
            <div key={subject.subject} className="surface rounded-2xl p-5">
              <button className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpen({ ...open, [subject.subject]: !isOpen })}>
                <div className="flex items-center gap-4">
                  <span className="h-4 w-4 rounded-full bg-sage-500" />
                  <div>
                    <h2 className="text-xl font-black">{subject.subject}</h2>
                    <p className="muted">{subject.completed} of {subject.total} topics completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-[#f4dfd6] px-3 py-1 text-sm font-bold text-[#9a3d2f]">{subjectPercent < 40 ? 'Needs Attention' : 'Steady'}</span>
                  <div className="hidden h-2 w-32 rounded-full bg-sage-100 dark:bg-white/10 sm:block">
                    <div className="h-full rounded-full bg-sage-500" style={{ width: `${subjectPercent}%` }} />
                  </div>
                  <b>{subjectPercent}%</b>
                  <ChevronDown className={isOpen ? 'rotate-180' : ''} />
                </div>
              </button>
              {isOpen && (
                <div className="mt-5 space-y-4">
                  {Object.entries(subject.chapters).map(([chapter, topics]) => (
                    <div key={chapter}>
                      <h3 className="mb-2 font-bold text-sage-500">{chapter}</h3>
                      <div className="space-y-2">
                        {topics.map((topic) => (
                          <button key={topic._id} className="flex w-full items-center gap-3 rounded-xl border border-[var(--line)] p-3 text-left" onClick={() => toggleTopic(topic)}>
                            <span className={`h-5 w-5 rounded-full border ${topic.completed ? 'border-sage-500 bg-sage-500' : 'border-sage-700'}`} />
                            <span className={topic.completed ? 'line-through muted' : ''}>{topic.topic}</span>
                            <span className="ml-auto rounded-full bg-sage-100 px-2 py-1 text-xs font-bold text-sage-700 dark:bg-sage-700/30 dark:text-sage-100">{topic.classification}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return <div><p className="muted">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>;
}
