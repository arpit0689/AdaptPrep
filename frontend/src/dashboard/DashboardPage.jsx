import { Flame, Medal, Target } from 'lucide-react';
import { useState } from 'react';
import LoadingState from '../components/LoadingState';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuthStore } from '../store/authStore';
import FocusTimer from './FocusTimer';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [refresh, setRefresh] = useState(0);
  const focus = useApi(() => api.get('/tasks/today-focus'), [refresh]);
  const analytics = useApi(() => api.get('/analytics'), [refresh]);

  const complete = async (task) => {
    await api.patch(`/tasks/${task._id}/complete`, { studyMinutesLogged: task.duration });
    setRefresh((value) => value + 1);
  };
  const skip = async (task) => {
    await api.patch(`/tasks/${task._id}/skip`);
    setRefresh((value) => value + 1);
  };

  if (focus.loading || analytics.loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <p className="font-bold text-sage-500">Today feels manageable.</p>
        <h1 className="mt-2 text-4xl font-black">Welcome, {user?.name}</h1>
        <p className="muted mt-2">Top priorities are intentionally limited so your focus stays calm and useful.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Streak" value={`${user?.streakCount || 0} days`} hint="Grace days protect sustainable discipline." />
        <StatCard label="Readiness" value={`${analytics.data?.readinessLevel || 0}%`} hint={analytics.data?.status || 'On Track'} tone="sand" />
        <StatCard label="Remaining" value={analytics.data?.remainingSyllabus || 0} hint="Topic-wise tasks left in roadmap." tone="lavender" />
      </section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="mb-4 flex items-center gap-2"><Target className="text-sage-500" /><h2 className="text-2xl font-black">Today&apos;s Focus</h2></div>
          <div className="space-y-3">
            {focus.data?.tasks?.length ? focus.data.tasks.map((task) => <TaskCard key={task._id} task={task} onComplete={complete} onSkip={skip} />) : <div className="surface rounded-2xl p-6">No heavy load today. Use this space for light revision or rest.</div>}
          </div>
        </div>
        <div className="space-y-4">
          <FocusTimer />
          <div className="surface rounded-2xl p-5">
            <div className="flex items-center gap-2"><Flame className="text-sage-500" /><h3 className="font-black">Supportive Recovery</h3></div>
            <p className="muted mt-2 text-sm">{user?.recoveryMode ? "Let's rebalance your roadmap gradually." : 'Your plan has buffers for human days.'}</p>
          </div>
          <div className="surface rounded-2xl p-5">
            <div className="flex items-center gap-2"><Medal className="text-sage-500" /><h3 className="font-black">Level {user?.level || 1}</h3></div>
            <p className="muted mt-2 text-sm">{user?.xp || 0} XP earned through steady study actions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
