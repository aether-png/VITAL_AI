import { useClock } from '../hooks/useClock';

export default function Navbar() {
  const time = useClock();
  return (
    <header className="glass-nav h-16 px-6 flex items-center justify-between shrink-0 z-50">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-cyan-400 text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
        <span className="text-xl font-bold text-white">
          VITAL<span className="text-cyan-400">-AI</span>
        </span>
        <div className="h-5 w-px bg-white/10 mx-1" />
        <span className="text-xs font-mono text-slate-500 tracking-widest hidden md:block">
          CLINICAL DECISION SUPPORT // ICU-04
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/60 border border-white/5">
          <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
          <span className="text-sm font-mono text-slate-300">{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 8px rgba(52,211,153,.6)' }} />
          <span className="text-xs font-medium text-emerald-400 tracking-wide">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
}
