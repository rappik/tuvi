'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  mounted: boolean;
}>({ theme: 'dark', toggle: () => {}, mounted: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Luôn khởi tạo là 'dark' trên cả Server và Client render lần đầu để đảm bảo 100% khớp Hydration
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('ziwei-theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch {
      // phòng ngừa môi trường không có localStorage
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      localStorage.setItem('ziwei-theme', theme);
    } catch {}
  }, [theme, mounted]);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    setTimeout(() => root.classList.remove('theme-transitioning'), 420);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
