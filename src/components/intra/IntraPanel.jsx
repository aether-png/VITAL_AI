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
    <section className="w-[360px] border-r border-white/5 bg-[#080D17] flex flex-col p-6 gap-5 shrink-0 overflow-y-auto">
      {/* Model badge */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 p-5">
        <div className="absolute -top-2 -right-2 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-7xl">neurology</span>
        </div>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white mb-2">CNN · v2.4 · Active</span>
        <h3 className="text-base font-semibold text-white">Intraoperative Hypotension</h3>
        <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
          Predicts hypotensive events within 10 min using a 30-step vital sign window.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['HeartRate','MeanBP','SysBP'].map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-white/10">{t}</span>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-300">Patient Vitals File</span>
          <span className="text-[10px] text-slate-500">CSV only</span>
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
          <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center">
            {file
              ? <span className="material-symbols-outlined text-2xl text-emerald-400" style={{ fontVariationSettings:"'FILL' 1" }}>check_circle</span>
              : <span className="material-symbols-outlined text-slate-400 text-2xl">upload_file</span>
            }
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">
              {file ? `📄 ${file.name}` : 'Drop patient CSV here'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {file ? `${(file.size/1024).toFixed(1)} KB — ready` : 'or click to browse'}
            </p>
          </div>
        </div>
      </div>

      {/* Backend status */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Backend</span>
          <span className="text-emerald-400 font-mono">localhost:8000</span>
        </div>
        <div className="h-0.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full"
            style={{ width:'100%', background:'linear-gradient(to right,#10B981,#059669)', boxShadow:'0 0 8px #10B981' }} />
        </div>
      </div>

      {/* Patient ID */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Patient ID (optional)</label>
          <span className="text-[10px] text-slate-600">Leave blank for random</span>
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
        className="w-full py-2.5 rounded-xl text-xs font-medium text-slate-400 border border-slate-700 hover:border-cyan-500/40 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
        style={{ background:'rgba(255,255,255,.02)' }}
      >
        <span className="material-symbols-outlined text-base">play_circle</span>
        Preview Demo (Offline)
      </button>

      <p className="text-center text-[10px] text-slate-600">
        Required: subject_id · charttime · HeartRate · MeanBP · SysBP
      </p>
    </section>
  );
}
