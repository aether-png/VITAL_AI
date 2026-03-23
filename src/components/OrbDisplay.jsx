import { STATES } from '../utils/states';

export default function OrbDisplay({ state = 'stable', riskPct }) {
  const cfg = STATES[state];
  const showRings = state !== 'stable';
  const ringDur  = state === 'critical' ? '0.8s' : '2s';

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative flex items-center justify-center">
        {/* Rings */}
        {showRings && (
          <>
            <div className="orb-ring absolute"
              style={{ width: 135, height: 135, color: cfg.color, borderColor: cfg.color, animationDuration: ringDur }} />
            <div className="orb-ring r2 absolute"
              style={{ width: 135, height: 135, color: cfg.color, borderColor: cfg.color, animationDuration: ringDur }} />
          </>
        )}
        {/* Orb */}
        <div className={`orb ${state} w-28 h-28 flex items-center justify-center`}>
          <span className="material-symbols-outlined text-3xl text-white drop-shadow-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {cfg.icon}
          </span>
        </div>
      </div>
      <div className="mt-5 text-center">
        <div className="text-xl font-black tracking-wide" style={{ color: cfg.color }}>{cfg.label}</div>
        <div className="text-[10px] font-mono mt-0.5 uppercase tracking-widest" style={{ color: cfg.color + '99' }}>
          {cfg.sub}
        </div>
        {riskPct !== undefined && (
          <div className="text-4xl font-black mt-2" style={{ color: cfg.color }}>
            {typeof riskPct === 'number' ? `${riskPct.toFixed(1)}%` : riskPct}
          </div>
        )}
      </div>
    </div>
  );
}
