import { STATES, speak, getLastTTSMsg } from '../utils/states';

export default function AlertBanner({ state, scorePct, onDismiss, bannerId }) {
  const cfg = STATES[state];
  if (!cfg?.alertBg) return null;

  const msg = cfg.tts(scorePct.toFixed(1));
  const titleText = state === 'critical' ? '🚨 Critical Alert Spoken'
                  : state === 'danger'   ? '⚠ Danger Alert Spoken'
                  : 'Voice Alert Spoken';

  return (
    <div
      id={bannerId}
      className="fade-up rounded-xl p-4 flex items-start gap-4 border-l-4"
      style={{ background: cfg.alertBg.bg, borderLeftColor: cfg.alertBg.border }}
    >
      <span className="material-symbols-outlined text-2xl mt-0.5">volume_up</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold uppercase tracking-widest mb-1">{titleText}</div>
        <div className="text-xs opacity-80">&ldquo;{msg}&rdquo;</div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => speak(msg)}
          className="p-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(255,255,255,.08)', color: 'var(--text-secondary)' }}
        ><span className="material-symbols-outlined text-base">replay</span></button>
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(255,255,255,.08)', color: 'var(--text-secondary)' }}
        ><span className="material-symbols-outlined text-base">close</span></button>
      </div>
    </div>
  );
}
