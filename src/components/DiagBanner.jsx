import { STATES } from '../utils/states';

export default function DiagBanner({ state, metaText, customTitle, customBody }) {
  const cfg = STATES[state];
  return (
    <div
      className="fade-up d3 rounded-xl p-5 border flex items-start gap-4"
      style={{ background: cfg.color + '18', borderColor: cfg.color + '33' }}
    >
      <span className="material-symbols-outlined text-2xl mt-0.5"
        style={{ fontVariationSettings: "'FILL' 1", color: cfg.color }}>
        {cfg.diagIcon}
      </span>
      <div>
        <div className="font-bold text-sm" style={{ color: cfg.color }}>
          {customTitle || cfg.diagTitle}
        </div>
        <div className="text-xs mt-1 opacity-70 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {customBody || cfg.diagBody}
        </div>
        {metaText && (
          <div className="text-[10px] mt-3" style={{ color: 'var(--text-muted)' }}>{metaText}</div>
        )}
      </div>
    </div>
  );
}
