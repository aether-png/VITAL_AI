export default function Sidebar({ currentView, onSwitch }) {
  const link = (view, icon, label) => {
    const active = currentView === view;
    return (
      <a
        href="#"
        onClick={e => { e.preventDefault(); onSwitch(view); }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${active ? 'nav-active' : 'nav-inactive'}`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
        {label}
      </a>
    );
  };

  return (
    <aside className="w-[220px] bg-[#08101B] border-r border-white/5 flex flex-col shrink-0">
      <nav className="flex-1 p-4 pt-6 space-y-1">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 px-3">Modules</div>
        {link('intra', 'ecg_heart', 'Intraoperative')}
        {link('post',  'local_hospital', 'Postoperative')}
        <a href="#"
          className="nav-inactive flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium">
          <span className="material-symbols-outlined text-xl">history</span>
          Patient History
        </a>
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            Dr
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Dr. Attending</div>
            <div className="text-[10px] text-slate-500">ICU Ward · Chief</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
