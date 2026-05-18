import { Moon, Monitor, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const options = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' }
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="surface flex rounded-xl p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`rounded-lg p-2 ${theme === value ? 'bg-sage-500 text-white' : 'muted'}`}
          title={label}
          aria-label={label}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
