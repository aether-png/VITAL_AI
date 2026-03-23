import { useRef, useState, useEffect, useCallback } from 'react';
import OrbDisplay from '../OrbDisplay';
import AlertBanner from '../AlertBanner';
import DiagBanner from '../DiagBanner';
import ChartModal from '../ChartModal';
import { STATES, getRiskState, speak } from '../../utils/states';
import { useRealtimePlot } from '../../hooks/useRealtimePlot';

export default function IntraResults({ data, onDismissAlert }) {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [badgeState, setBadgeState] = useState({ text: '✓ STABLE — Waiting for data…', isDanger: false });
  const [stdStatus, setStdStatus] = useState('● LIVE MONITORING — NO AI ANALYSIS');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('std');

  const stdCanvasRef = useRef(null);
  const aiCanvasRef  = useRef(null);

  const { start, allVitalsRef } = useRealtimePlot({
    stdCanvasRef,
    aiCanvasRef,
    onBadgeUpdate: useCallback(({ type, prediction, step, total }) => {
      if (type === 'complete') {
        setBadgeState({ text: '✅ ANALYSIS COMPLETE', isDanger: false });
        setStdStatus('● MONITORING COMPLETE');
      } else if (type === 'point') {
        setBadgeState(
          prediction === 1
            ? { text: '⚠ HYPOTENSION PREDICTED — Intervention Needed', isDanger: true }
            : { text: '✓ STABLE — No Hypotension Detected', isDanger: false }
        );
        setStdStatus(`● LIVE — Step ${step} of ${total}`);
      }
    }, []),
    onStepUpdate: useCallback(() => {}, []),
  });

  useEffect(() => {
    if (!data) return;
    setAlertDismissed(false);
    setBadgeState({ text: '✓ STABLE — Waiting for data…', isDanger: false });
    setStdStatus('● LIVE MONITORING — NO AI ANALYSIS');
    if (data.vitals?.length > 0) {
      // Small delay to allow canvas refs to mount
      setTimeout(() => start(data.vitals), 100);
    }
    // TTS
    const st = getRiskState(data.risk_score);
    if (STATES[st].tts) {
      setTimeout(() => speak(STATES[st].tts((data.risk_score * 100).toFixed(1))), 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!data) {
    return (
      <section className="flex-1 bg-[#060B13] relative overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'radial-gradient(#1e293b 1px,transparent 1px)', backgroundSize:'38px 38px', opacity:.12 }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <div className="relative w-full" style={{ height: 2 }}>
            <div className="scanner" />
          </div>
          <div className="text-center mt-12">
            <div className="text-7xl font-black text-white/4 tracking-tighter mb-4">VITAL-AI</div>
            <p className="text-slate-600 text-sm">Upload a patient CSV and run analysis to begin</p>
            <p className="text-slate-700 text-xs mt-1">CNN · MIMIC-III · 30-min window</p>
          </div>
        </div>
      </section>
    );
  }

  const score = data.risk_score;
  const pct   = score * 100;
  const state = getRiskState(score);
  const cfg   = STATES[state];

  return (
    <section className="flex-1 bg-[#060B13] relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:'radial-gradient(#1e293b 1px,transparent 1px)', backgroundSize:'38px 38px', opacity:.12 }} />

      <div className="relative z-10 p-8 max-w-5xl mx-auto space-y-5">
        {/* Alert Banner */}
        {!alertDismissed && (
          <AlertBanner state={state} scorePct={pct} onDismiss={() => setAlertDismissed(true)} />
        )}

        {/* Orb + Stat Cards */}
        <div className="grid grid-cols-3 gap-5 items-center fade-up d1">
          <OrbDisplay state={state} riskPct={pct} />
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {/* Patient ID */}
            <div className="glass p-4 rounded-xl flex flex-col justify-between min-h-[105px] relative overflow-hidden group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl">badge</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Patient ID</span>
              <div>
                <div className="text-xl font-mono font-bold text-white">#PT-{data.patient_id}</div>
                <div className="text-[10px] text-slate-500 mt-1">Selected subject</div>
              </div>
            </div>
            {/* Scan Time */}
            <div className="glass p-4 rounded-xl flex flex-col justify-between min-h-[105px] relative overflow-hidden group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl">schedule</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Scan Time</span>
              <div>
                <div className="text-sm font-mono font-bold text-cyan-400 break-all">{data.occurrence_time || '—'}</div>
                <div className="text-[10px] text-slate-500 mt-1">Last chart event</div>
              </div>
            </div>
            {/* Risk Score */}
            <div className="glass p-4 rounded-xl flex flex-col justify-between min-h-[105px] relative overflow-hidden border border-white/5">
              <div className="absolute right-2 top-2 opacity-10">
                <span className="material-symbols-outlined text-4xl" style={{ color: cfg.color }}>warning</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: cfg.color }}>Risk Score</span>
              <div>
                <div className="text-2xl font-black" style={{ color: cfg.color }}>{pct.toFixed(1)}%</div>
                <div className="w-full h-1 mt-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width:`${pct}%`, background: cfg.color, boxShadow:`0 0 8px ${cfg.color}` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Charts Side by Side */}
        <div className="grid grid-cols-2 gap-4 fade-up d2">
          {/* Standard Monitoring */}
          <div className="glass rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Standard Monitoring</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Without AI Prediction Model</p>
              </div>
            </div>
            <div className="flex gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 rounded inline-block" /><span className="text-[10px] text-slate-400">SysBP</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 rounded inline-block" /><span className="text-[10px] text-slate-400">MeanBP</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 rounded inline-block" /><span className="text-[10px] text-slate-400">HeartRate</span></div>
            </div>
            <div className="prediction-badge safe mb-3 text-center">{stdStatus}</div>
            <div className="chart-wrap" onClick={() => { setModalMode('std'); setModalOpen(true); }}>
              <canvas ref={stdCanvasRef} />
            </div>
          </div>

          {/* AI-Enhanced Monitoring */}
          <div className="glass rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">AI-Enhanced Monitoring</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">With CNN Prediction Model</p>
              </div>
            </div>
            <div className="flex gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 rounded inline-block" /><span className="text-[10px] text-slate-400">SysBP</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 rounded inline-block" /><span className="text-[10px] text-slate-400">MeanBP</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 rounded inline-block" /><span className="text-[10px] text-slate-400">HeartRate</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/40 inline-block border border-red-500" /><span className="text-[10px] text-slate-400">Hypotension Predicted</span></div>
            </div>
            <div className={`prediction-badge mb-3 text-center ${badgeState.isDanger ? 'danger' : 'safe'}`}>
              {badgeState.text}
            </div>
            <div className="chart-wrap" onClick={() => { setModalMode('ai'); setModalOpen(true); }}>
              <canvas ref={aiCanvasRef} />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <DiagBanner
          state={state}
          metaText={`CNN · MIMIC-III · 30-min window · File: ${data.filename_processed}`}
        />
      </div>

      {/* Full-screen Chart Modal */}
      <ChartModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vitals={allVitalsRef.current}
        mode={modalMode}
      />
    </section>
  );
}
