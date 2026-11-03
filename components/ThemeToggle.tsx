'use client';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  minimal?: boolean;
}

export default function ThemeToggle({ className = '', minimal = false }: ThemeToggleProps) {
  const { theme, toggle, mounted } = useTheme();
  // Khi chưa mounted (SSR & hydrate), giữ nguyên trạng thái server (dark) để tránh hydration mismatch
  const isDark = mounted ? theme === 'dark' : true;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      suppressHydrationWarning
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      title={isDark ? 'Chuyển sang giao diện sáng (Cổ phong ngà)' : 'Chuyển sang giao diện tối (Huyền tinh dạ)'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border cursor-pointer select-none transition-colors duration-300 ${className}`}
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(161,98,7,0.3)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.9)',
      }}
    >
      <div
        className="relative w-8 h-4 rounded-full flex-shrink-0 flex items-center p-0.5"
        style={{
          background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(234,179,8,0.35)',
        }}
      >
        <motion.div
          animate={{ x: isDark ? 0 : 14 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-3 h-3 rounded-full flex items-center justify-center text-[7.5px] leading-none shadow-sm"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #d4a843, #f5d77f)'
              : 'linear-gradient(135deg, #d97706, #f59e0b)',
          }}
        >
          {isDark ? '🌙' : '☀️'}
        </motion.div>
      </div>
      {!minimal && (
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{
            color: isDark ? 'rgba(212,180,100,0.9)' : 'rgba(120,53,15,0.9)',
          }}
        >
          {isDark ? 'Tối' : 'Sáng'}
        </span>
      )}
    </motion.button>
  );
}
