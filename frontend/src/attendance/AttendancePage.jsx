import { useState } from 'react';
import LoadingState from '../components/LoadingState';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function AttendancePage() {
  const [studiedHours, setStudiedHours] = useState(3);
  const [refresh, setRefresh] = useState(0);
  const { data, loading } = useApi(() => api.get('/attendance/summary?days=30'), [refresh]);

  const mark = async () => {
    await api.post('/attendance', { studiedHours });
    setRefresh((value) => value + 1);
  };

  if (loading) return <LoadingState label="Preparing attendance patterns..." />;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-4xl font-black">Attendance</h1>
      <p className="muted mt-2">Attendance can be manual or automatic once completed study hours reach 70% of plan.</p>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="30-day Attendance" value={`${data.attendancePercentage}%`} hint="Present and grace days included" />
        <StatCard label="Weekly Score" value={`${data.weeklyConsistency}/7`} hint="A gentle consistency signal" tone="sand" />
        <div className="surface rounded-2xl p-5">
          <h3 className="font-black">Log today</h3>
          <input className="mt-5 w-full accent-[#748b5d]" type="range" min="0" max="14" step="0.5" value={studiedHours} onChange={(event) => setStudiedHours(event.target.value)} />
          <div className="mt-3 text-3xl font-black">{studiedHours}h</div>
          <button className="btn-primary mt-4 w-full" onClick={mark}>Mark Attendance</button>
        </div>
      </section>
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {data.records.map((record) => (
          <div key={record._id} className="surface rounded-2xl p-3 text-center">
            <p className="text-xs font-bold text-sage-500">{record.dateKey.slice(5)}</p>
            <p className="mt-2 text-sm font-bold">{record.attendanceStatus}</p>
            <p className="muted text-xs">{record.studiedHours}h</p>
          </div>
        ))}
      </section>
    </div>
  );
}
