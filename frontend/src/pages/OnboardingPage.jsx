import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

const exams = ['JEE', 'NEET', 'UPSC', 'GATE', 'SSC', 'CAT', 'CUET', 'BOARDS'];

export default function OnboardingPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [step, setStep] = useState(1);
  const [syllabus, setSyllabus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    examName: 'JEE',
    examDate: '',
    dailyStudyHours: 4,
    weakSubjects: [],
    subjectPriorities: [],
    studyTiming: 'Morning',
    preferredTheme: user?.preferredTheme || 'system'
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/onboarding/syllabus?examName=${form.examName}`).then(({ data }) => {
      setSyllabus(data);
      setForm((prev) => ({ ...prev, subjectPriorities: data.subjects.map((subject) => subject.name) }));
    });
  }, [form.examName]);

  const estimated = useMemo(() => {
    const topics = syllabus?.subjects.reduce((sum, subject) => sum + subject.chapters.reduce((inner, chapter) => inner + chapter.topics.length, 0), 0) || 0;
    return Math.ceil((topics * 90) / (form.dailyStudyHours * 60));
  }, [syllabus, form.dailyStudyHours]);

  const toggleWeak = (subject) => {
    setForm((prev) => ({
      ...prev,
      weakSubjects: prev.weakSubjects.includes(subject) ? prev.weakSubjects.filter((item) => item !== subject) : [...prev.weakSubjects, subject]
    }));
  };

  const movePriority = (subject, direction) => {
    const list = [...form.subjectPriorities];
    const index = list.indexOf(subject);
    const next = index + direction;
    if (next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]];
    setForm({ ...form, subjectPriorities: list });
  };

  const finish = async () => {
    setSaving(true);
    const { data } = await api.post('/onboarding/complete', form);
    setUser(data.user);
    navigate('/');
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <h1 className="text-2xl font-black">AdaptPrep Onboarding</h1>
        <ThemeToggle />
      </div>
      <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="surface mx-auto mt-8 max-w-5xl rounded-3xl p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-bold text-sage-500">Step {step} of 5</p>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-sage-100 dark:bg-white/10">
            <div className="h-full bg-sage-500" style={{ width: `${step * 20}%` }} />
          </div>
        </div>

        {step === 1 && (
          <section>
            <h2 className="text-3xl font-black">Tell us your exam goal</h2>
            <p className="muted mt-2">Subjects and topic hierarchy are generated automatically from the syllabus engine.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {exams.map((exam) => <button key={exam} className={`rounded-2xl border p-4 font-bold ${form.examName === exam ? 'border-sage-500 bg-sage-100 text-sage-700 dark:bg-sage-700/30 dark:text-sage-100' : 'border-[var(--line)]'}`} onClick={() => setForm({ ...form, examName: exam })}>{exam}</button>)}
            </div>
            <label className="mt-6 block font-bold">Exam date</label>
            <input className="calm-input mt-2" type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} />
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-3xl font-black">Set a sustainable daily rhythm</h2>
            <p className="muted mt-2">The planner uses this to avoid unrealistic task loads and leave recovery room.</p>
            <input className="mt-8 w-full accent-[#748b5d]" type="range" min="1" max="12" value={form.dailyStudyHours} onChange={(e) => setForm({ ...form, dailyStudyHours: Number(e.target.value) })} />
            <div className="mt-4 text-5xl font-black">{form.dailyStudyHours}h</div>
            <p className="muted mt-3">{form.dailyStudyHours <= 4 ? 'Gentle and sustainable. Great for consistency building.' : form.dailyStudyHours <= 8 ? 'Focused pace with healthy buffers.' : 'Intense pace. AdaptPrep will include more recovery safeguards.'}</p>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-3xl font-black">Auto-generated subjects</h2>
            <p className="muted mt-2">Reorder priorities and mark weak areas. Subject creation stays managed by the engine.</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {form.subjectPriorities.map((subject, index) => (
                <div key={subject} className="surface rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-sage-500">Priority {index + 1}</p>
                      <h3 className="text-xl font-black">{subject}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-ghost" onClick={() => movePriority(subject, -1)}>Up</button>
                      <button className="btn-ghost" onClick={() => movePriority(subject, 1)}>Down</button>
                    </div>
                  </div>
                  <button className={`mt-3 rounded-xl px-3 py-2 text-sm font-bold ${form.weakSubjects.includes(subject) ? 'bg-lavender text-[#514765]' : 'bg-sage-100 text-sage-700'}`} onClick={() => toggleWeak(subject)}>
                    {form.weakSubjects.includes(subject) ? 'Weak focus selected' : 'Mark as weak focus'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="text-3xl font-black">Preferred study timing</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {['Morning', 'Afternoon', 'Night', 'Flexible'].map((timing) => <button key={timing} className={`rounded-2xl border p-5 font-bold ${form.studyTiming === timing ? 'border-sage-500 bg-sage-100 text-sage-700 dark:bg-sage-700/30 dark:text-sage-100' : 'border-[var(--line)]'}`} onClick={() => setForm({ ...form, studyTiming: timing })}>{timing}</button>)}
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="text-3xl font-black">Your roadmap is ready to generate</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="surface rounded-2xl p-4"><Calendar className="mb-3 text-sage-500" /><b>{estimated} days</b><p className="muted text-sm">Estimated first syllabus pass</p></div>
              <div className="surface rounded-2xl p-4"><CheckCircle2 className="mb-3 text-sage-500" /><b>{syllabus?.subjects.length || 0} subjects</b><p className="muted text-sm">Fetched from engine</p></div>
              <div className="surface rounded-2xl p-4"><b>{form.weakSubjects.length}</b><p className="muted text-sm">Weak areas get calmer priority</p></div>
            </div>
          </section>
        )}

        <div className="mt-8 flex justify-between">
          <button className="btn-ghost inline-flex items-center gap-2" disabled={step === 1} onClick={() => setStep(step - 1)}><ArrowLeft size={18} /> Back</button>
          {step < 5 ? <button className="btn-primary inline-flex items-center gap-2" disabled={step === 1 && !form.examDate} onClick={() => setStep(step + 1)}>Next <ArrowRight size={18} /></button> : <button className="btn-primary" onClick={finish} disabled={saving}>{saving ? 'Generating...' : 'Start AdaptPrep'}</button>}
        </div>
      </motion.div>
    </div>
  );
}
