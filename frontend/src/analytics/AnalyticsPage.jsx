import LoadingState from '../components/LoadingState';
import StatCard from '../components/StatCard';
import { CompletionChart, StudyTrendChart, SubjectDistributionChart } from '../charts/AnalyticsCharts';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function AnalyticsPage() {
  const { data, loading } = useApi(() => api.get('/analytics'), []);
  if (loading) return <LoadingState label="Reading your consistency patterns..." />;

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-4xl font-black">Analytics</h1>
      <p className="muted mt-2">Progress signals are framed to guide the next calm action.</p>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Status" value={data.status} hint="Adaptive readiness state" />
        <StatCard label="Backlog" value={data.backlogCount} hint="Gradually recoverable tasks" tone="sand" />
        <StatCard label="Pace" value={`${data.requiredStudyPace}/day`} hint="Required topic pace" tone="lavender" />
        <StatCard label="Revision" value={data.revisionAnalytics.due} hint="Spaced recall due" />
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <StudyTrendChart data={data.attendanceTrend} />
        <SubjectDistributionChart data={data.subjectDistribution} />
        <CompletionChart data={data.subjectDistribution} />
        <div className="surface rounded-2xl p-5">
          <h3 className="font-black">Weak Area Signals</h3>
          <div className="mt-4 space-y-3">
            {data.weakSubjects.length ? data.weakSubjects.slice(0, 8).map((topic) => (
              <div key={topic._id} className="rounded-xl bg-sage-100 p-3 text-sm text-sage-700 dark:bg-sage-700/30 dark:text-sage-100">
                {topic.subject} &rarr; {topic.chapter} &rarr; {topic.topic}: {topic.classification}
              </div>
            )) : <p className="muted">No critical weak pattern detected right now.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
