import { motion } from 'framer-motion';
import { Brain, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthStore } from '../store/authStore';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login({ email: form.email, password: form.password });
      else await register(form);
      navigate(mode === 'login' ? '/' : '/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Please try again gently.');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="absolute right-5 top-5"><ThemeToggle /></div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <section className="flex flex-col justify-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-500 text-white"><Leaf /></div>
          <h1 className="text-5xl font-black leading-tight">AdaptPrep</h1>
          <p className="muted mt-4 max-w-xl text-lg">An adaptive study operating system for consistency, recovery, revision retention, and calm long-term preparation.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['JEE', 'NEET', 'UPSC'].map((exam) => <div key={exam} className="surface rounded-2xl p-4 font-bold">{exam}</div>)}
          </div>
        </section>
        <form onSubmit={submit} className="surface rounded-3xl p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <Brain className="text-sage-500" />
            <div>
              <h2 className="text-2xl font-black">{mode === 'login' ? 'Welcome back' : 'Create your study OS'}</h2>
              <p className="muted text-sm">Steady work, softly guided.</p>
            </div>
          </div>
          {mode === 'register' && <input className="calm-input mb-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input className="calm-input mb-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="calm-input mb-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="mb-3 rounded-xl bg-[#f4dfd6] p-3 text-sm text-[#77422f]">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Preparing...' : mode === 'login' ? 'Login' : 'Register'}</button>
          <button type="button" className="muted mt-4 w-full text-sm" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'New here? Register' : 'Already have an account? Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
