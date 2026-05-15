import { useState } from 'react';

const FIELDS = [
  { id: 'age',          label: 'Age',              placeholder: '62',  type:'number' },
  { id: 'gender',       label: 'Gender (0=M, 1=F)', placeholder: '1',  type:'number', min:0, max:1 },
  { id: 'Creatinine',   label: 'Creatinine',        placeholder: '1.2', type:'number', step:'0.1' },
  { id: 'WBC',          label: 'WBC',               placeholder: '8.5', type:'number', step:'0.1' },
  { id: 'Hemoglobin',   label: 'Hemoglobin',        placeholder: '11.4',type:'number', step:'0.1' },
  { id: 'Platelet',     label: 'Platelet',          placeholder: '180', type:'number' },
  { id: 'Lactate',      label: 'Lactate',           placeholder: '2.1', type:'number', step:'0.1' },
  { id: 'Potassium',    label: 'Potassium',         placeholder: '4.2', type:'number', step:'0.1' },
  { id: 'Sodium',       label: 'Sodium',            placeholder: '138', type:'number' },
  { id: 'diabetes',     label: 'Diabetes (0/1)',    placeholder: '1',   type:'number', min:0, max:1 },
  { id: 'hypertension', label: 'Hypertension (0/1)',placeholder: '1',   type:'number', min:0, max:1 },
  { id: 'stroke',       label: 'Stroke (0/1)',      placeholder: '0',   type:'number', min:0, max:1 },
];

const PROFILES = [
  { age:68, gender:1, Creatinine:2.8, WBC:13.5, Hemoglobin:9.2,  Platelet:130, Lactate:3.4, Potassium:5.3, Sodium:143, diabetes:1, hypertension:1, stroke:0 },
  { age:45, gender:0, Creatinine:0.9, WBC:6.8,  Hemoglobin:13.5, Platelet:220, Lactate:1.3, Potassium:4.1, Sodium:138, diabetes:0, hypertension:0, stroke:0 },
];
let profileIdx = -1;

export default function PostPanel({ onAnalyze, onDemo, loading }) {
  const [values, setValues] = useState({});
  const [highlighted, setHighlighted] = useState({});

  const set = (id, val) => setValues(v => ({ ...v, [id]: val }));

  const handleAnalyze = () => {
    const payload = {};
    for (const f of FIELDS) {
      const val = values[f.id];
      if (val === '' || val === undefined || val === null) {
        alert(`Please fill in: ${f.label}`); return;
      }
      payload[f.id] = parseFloat(val);
    }
    onAnalyze(payload);
  };

  const loadSample = () => {
    profileIdx = (profileIdx + 1) % 2;
    const p = PROFILES[profileIdx];
    setValues({ ...p });
    // Flash highlight
    const h = {};
    FIELDS.forEach(f => { h[f.id] = true; });
    setHighlighted(h);
    setTimeout(() => setHighlighted({}), 800);
  };

  return (
    <section className="w-[360px] flex flex-col p-6 gap-4 shrink-0 overflow-y-auto transition-colors duration-300"
      style={{ borderRight: '1px solid var(--sidebar-border)', background: 'var(--bg-surface)' }}>
      {/* Model badge */}
      <div className="relative overflow-hidden rounded-xl border p-5"
        style={{ background: 'var(--bg-glass)', borderColor: 'rgba(16,185,129,.25)' }}>
        <div className="absolute -top-2 -right-2 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-7xl">local_hospital</span>
        </div>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white mb-2">
          XGBoost · v1.0 · Active
        </span>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Postoperative ICU Transfer</h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: .85 }}>
          Predicts ICU transfer risk after surgery using 12 clinical lab parameters.
        </p>
      </div>

      {/* Lab inputs */}
      <div className="grid grid-cols-2 gap-2.5">
        {FIELDS.map(f => (
          <div key={f.id} className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              min={f.min} max={f.max} step={f.step}
              className="inp"
              value={values[f.id] ?? ''}
              style={highlighted[f.id] ? { borderColor: '#06B6D4' } : {}}
              onChange={e => set(f.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Analyze */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background:'linear-gradient(135deg,#059669,#047857)', boxShadow:'0 4px 24px rgba(5,150,105,.3)' }}
      >
        <span className={`material-symbols-outlined text-xl ${loading ? 'spinning' : ''}`}>
          {loading ? 'sync' : 'biotech'}
        </span>
        <span>{loading ? 'Running XGBoost…' : 'ANALYZE POST-OP RISK'}</span>
      </button>

      {/* Load Sample */}
      <button
        onClick={loadSample}
        className="w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
        style={{ background:'var(--badge-bg)', color:'var(--text-muted)', border:'1px solid var(--border-input)' }}
      >
        <span className="material-symbols-outlined text-base">person_add</span>
        Load Sample Patient
      </button>

      {/* Demo */}
      <button
        onClick={onDemo}
        className="w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
        style={{ background:'var(--badge-bg)', color:'var(--text-muted)', border:'1px solid var(--border-input)' }}
      >
        <span className="material-symbols-outlined text-base">play_circle</span>
        Preview Demo (Offline)
      </button>

      <p className="text-center text-[10px]" style={{ color: 'var(--text-muted)', opacity: .8 }}>XGBoost · MIMIC-III · 12 clinical parameters</p>
    </section>
  );
}
