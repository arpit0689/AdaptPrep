import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [theme, setThemeState] = useState(localStorage.getItem('adaptprep_theme') || user?.preferredTheme || 'system');

  const resolvedTheme = useMemo(() => {
    if (theme !== 'system') return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    localStorage.setItem('adaptprep_theme', theme);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (user?.preferredTheme) setThemeState(user.preferredTheme);
  }, [user?.preferredTheme]);

  const setTheme = async (nextTheme) => {
    setThemeState(nextTheme);
    if (user) {
      const { data } = await api.patch('/settings', { preferredTheme: nextTheme });
      setUser(data.user);
    }
  };

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
