import { useRef, useState, useCallback } from 'react';

export default function IntraPanel({ onAnalyze, onDemo, loading }) {
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const acceptFile = useCallback(f => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.csv')) { alert('Please select a .CSV file.'); return; }
    setFile(f);
  }, []);

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    acceptFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = () => {
    if (file) onAnalyze(file, patientId);
  };

  return (
    <section className="w-[360px] flex flex-col p-6 gap-5 shrink-0 overflow-y-auto transition-colors duration-300"
      style={{ borderRight: '1px solid var(--sidebar-border)', background: 'var(--bg-surface)' }}>
      {/* Model badge */}
      <div className="relative overflow-hidden rounded-xl border p-5"
        style={{ background: 'var(--bg-glass)', borderColor: 'rgba(99,102,241,.25)' }}>
        <div className="absolute -top-2 -right-2 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-7xl">neurology</span>
        </div>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white mb-2">CNN · v2.4 · Active</span>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Intraoperative Hypotension</h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: .85 }}>
          Predicts hypotensive events within 10 min using a 30-step vital sign window.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['HeartRate','MeanBP','SysBP'].map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{ background: 'var(--badge-bg)', color: 'var(--text-secondary)', borderColor: 'var(--badge-border)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Patient Vitals File</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>CSV only</span>
        </div>
        <div
          className={`drop-zone min-h-[160px] flex flex-col items-center justify-center text-center p-5 gap-3 ${dragging ? 'dragover' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" accept=".csv" className="hidden"
            onChange={e => acceptFile(e.target.files[0])} />
          <div className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'var(--badge-bg)' }}>
            {file
              ? <span className="material-symbols-outlined text-2xl text-emerald-400" style={{ fontVariationSettings:"'FILL' 1" }}>check_circle</span>
              : <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--text-muted)' }}>upload_file</span>
            }
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {file ? `📄 ${file.name}` : 'Drop patient CSV here'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {file ? `${(file.size/1024).toFixed(1)} KB — ready` : 'or click to browse'}
            </p>
          </div>
        </div>
      </div>

      {/* Backend status */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>Backend</span>
          <span className="text-emerald-400 font-mono">localhost:8000</span>
        </div>
        <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--badge-bg)' }}>
          <div className="h-full rounded-full"
            style={{ width:'100%', background:'linear-gradient(to right,#10B981,#059669)', boxShadow:'0 0 8px #10B981' }} />
        </div>
      </div>

      {/* Patient ID */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Patient ID (optional)</label>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: .7 }}>Leave blank for random</span>
        </div>
        <input
          type="text"
          placeholder="e.g. 40177"
          className="inp"
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
        />
      </div>

      {/* Analyze button */}
      <button
        disabled={!file || loading}
        onClick={handleAnalyze}
        className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed"
        style={{ background:'linear-gradient(135deg,#0ea5e9,#2563eb)', boxShadow:'0 4px 24px rgba(14,165,233,.25)' }}
      >
        <span className={`material-symbols-outlined text-xl ${loading ? 'spinning' : ''}`}>
          {loading ? 'sync' : 'ecg_heart'}
        </span>
        <span>{loading ? 'Running CNN Model…' : 'ANALYZE PATIENT VITALS'}</span>
      </button>

      {/* Demo button */}
      <button
        onClick={onDemo}
        className="w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
        style={{ background:'var(--badge-bg)', color:'var(--text-muted)', border:'1px solid var(--border-input)' }}
      >
        <span className="material-symbols-outlined text-base">play_circle</span>
        Preview Demo (Offline)
      </button>

      <p className="text-center text-[10px]" style={{ color: 'var(--text-muted)', opacity: .8 }}>
        Required: subject_id · charttime · HeartRate · MeanBP · SysBP
      </p>
    </section>
  );
}
