import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [dailyStudyHours, setDailyStudyHours] = useState(user?.dailyStudyHours || 4);
  const [studyTiming, setStudyTiming] = useState(user?.studyTiming || 'Flexible');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const { data } = await api.patch('/settings', { dailyStudyHours, studyTiming });
    setUser(data.user);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-black">Settings</h1>
      <p className="muted mt-2">Tune the environment without disturbing your roadmap.</p>
      <section className="surface mt-6 rounded-2xl p-5">
        <h2 className="text-xl font-black">Theme</h2>
        <div className="mt-4"><ThemeToggle /></div>
      </section>
      <section className="surface mt-4 rounded-2xl p-5">
        <h2 className="text-xl font-black">Study rhythm</h2>
        <label className="mt-5 block font-bold">Daily study hours</label>
        <input className="mt-3 w-full accent-[#748b5d]" type="range" min="1" max="12" value={dailyStudyHours} onChange={(event) => setDailyStudyHours(Number(event.target.value))} />
        <p className="mt-2 text-3xl font-black">{dailyStudyHours}h</p>
        <label className="mt-5 block font-bold">Preferred timing</label>
        <select className="calm-input mt-2" value={studyTiming} onChange={(event) => setStudyTiming(event.target.value)}>
          {['Morning', 'Afternoon', 'Night', 'Flexible'].map((value) => <option key={value}>{value}</option>)}
        </select>
        <button className="btn-primary mt-5" onClick={save}>Save settings</button>
        {saved && <p className="mt-3 text-sm font-bold text-sage-500">Settings saved.</p>}
      </section>
    </div>
  );
}
