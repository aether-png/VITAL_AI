import { useState, useEffect } from 'react';
import OrbDisplay from '../OrbDisplay';
import AlertBanner from '../AlertBanner';
import DiagBanner from '../DiagBanner';
import { STATES, getRiskState, speak } from '../../utils/states';

const LAB_LABELS = {
  age:'Age', gender:'Gender', Creatinine:'Creatinine', WBC:'WBC',
  Hemoglobin:'Hemoglobin', Platelet:'Platelet', Lactate:'Lactate',
  Potassium:'Potassium', Sodium:'Sodium', diabetes:'Diabetes',
  hypertension:'Hypertension', stroke:'Stroke',
};

export default function PostResults({ data }) {
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    if (!data) return;
    setAlertDismissed(false);
    const st = getRiskState(data.risk_score);
    if (STATES[st].tts) {
      setTimeout(() => speak(STATES[st].tts((data.risk_score * 100).toFixed(1))), 600);
    }
  }, [data]);

  if (!data) {
    return (
      <section className="flex-1 relative overflow-y-auto transition-colors duration-300"
        style={{ background: 'var(--bg-base)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'radial-gradient(var(--border-input) 1px,transparent 1px)', backgroundSize:'38px 38px', opacity:.08 }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <div className="text-center">
            <div className="text-7xl font-black tracking-tighter mb-4" style={{ color: 'var(--text-primary)', opacity: .04 }}>POST-OP</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter patient lab values and click Analyze</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: .7 }}>XGBoost · 12 clinical parameters</p>
          </div>
        </div>
      </section>
    );
  }

  const score = data.risk_score;
  const pct   = score * 100;
  const state = getRiskState(score);
  const cfg   = STATES[state];
  const isCritical = score >= 0.5;

  return (
    <section className="flex-1 relative overflow-y-auto transition-colors duration-300"
      style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:'radial-gradient(var(--border-input) 1px,transparent 1px)', backgroundSize:'38px 38px', opacity:.08 }} />

      <div className="relative z-10 p-8 max-w-4xl mx-auto space-y-5">
        {/* Alert Banner */}
        {!alertDismissed && (
          <AlertBanner state={state} scorePct={pct} onDismiss={() => setAlertDismissed(true)} />
        )}

        {/* Orb + Cards */}
        <div className="grid grid-cols-3 gap-5 items-center fade-up d1">
          <OrbDisplay state={state} riskPct={pct} />
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {/* Risk Score card */}
            <div className="glass p-4 rounded-xl flex flex-col justify-between min-h-[105px]">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Risk Score</span>
              <div>
                <div className="text-2xl font-black" style={{ color: cfg.color }}>{pct.toFixed(1)}%</div>
                <div className="h-1 mt-2 rounded-full overflow-hidden" style={{ background: 'var(--badge-bg)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width:`${pct}%`, background: cfg.color, boxShadow:`0 0 8px ${cfg.color}` }} />
                </div>
              </div>
            </div>
            {/* Prediction card */}
            <div className="glass p-4 rounded-xl flex flex-col justify-between min-h-[105px]">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Prediction</span>
              <div className="text-sm font-bold" style={{ color: cfg.color }}>
                {isCritical ? '⚠ ICU Transfer Likely' : '✓ ICU Transfer Unlikely'}
              </div>
            </div>
          </div>
        </div>

        {/* Lab values grid */}
        <div className="glass rounded-xl p-6 fade-up d2">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Input Lab Values</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(data.inputs).map(([k, v]) => (
              <div key={k} className="glass p-3 rounded-lg">
                <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{LAB_LABELS[k] || k}</div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <DiagBanner
          state={state}
          customTitle={isCritical ? '⚠ HIGH RISK — ICU Transfer Likely' : '✓ LOW RISK — ICU Transfer Unlikely'}
          customBody={isCritical
            ? 'Elevated risk of postoperative ICU transfer. Patient presents abnormal clinical parameters. Immediate monitoring and ICU readiness advised.'
            : 'Low risk of postoperative ICU transfer. Clinical parameters within acceptable bounds. Standard postoperative monitoring recommended.'
          }
          metaText="XGBoost · MIMIC-III · 12 clinical parameters"
        />
      </div>
    </section>
  );
}
