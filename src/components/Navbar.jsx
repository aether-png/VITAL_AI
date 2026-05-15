import { useClock } from '../hooks/useClock';

export default function Navbar({ theme, toggleTheme }) {
  const time = useClock();
  return (
    <header className="glass-nav h-16 px-6 flex items-center justify-between shrink-0 z-50">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-cyan-400 text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
        <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          VITAL<span className="text-cyan-400">-AI</span>
        </span>
        <div className="h-5 w-px bg-white/10 mx-1" />
        <span className="text-xs font-mono tracking-widest hidden md:block" style={{ color: 'var(--text-muted)' }}>
          CLINICAL DECISION SUPPORT // ICU-04
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border"
          style={{ background: 'var(--badge-bg)', borderColor: 'var(--badge-border)' }}>
          <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
          <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 8px rgba(52,211,153,.6)' }} />
          <span className="text-xs font-medium text-emerald-400 tracking-wide">SYSTEM ONLINE</span>
        </div>
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'var(--badge-bg)',
            borderColor: 'var(--badge-border)',
            color: theme === 'dark' ? '#facc15' : '#6366f1',
          }}
        >
          <span
            className="material-symbols-outlined text-xl transition-all duration-300"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
}
