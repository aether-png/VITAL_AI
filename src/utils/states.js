// ── STATES config ────────────────────────────────────────────────────────────
export const STATES = {
  stable: {
    label: 'STABLE',
    sub: 'No Immediate Risk',
    icon: 'favorite',
    color: '#34D399',
    tw: 'text-emerald-400',
    alertBg: null,
    tts: null,
    diagIcon: 'check_circle',
    diagTitle: 'STABLE — No Immediate Intervention Required',
    diagBody: 'Model analysis indicates no imminent hypotensive event. Routine monitoring continues.',
  },
  caution: {
    label: 'CAUTION',
    sub: 'Elevated Risk — Monitor Closely',
    icon: 'health_metrics',
    color: '#FBBF24',
    tw: 'text-amber-400',
    alertBg: { bg: 'rgba(251,191,36,.1)', border: '#FBBF24' },
    tts: p => `Caution. Risk level is elevated at ${p} percent. Please monitor the patient closely.`,
    diagIcon: 'warning',
    diagTitle: 'CAUTION — Elevated Risk Detected',
    diagBody: 'Elevated probability detected. Continuous monitoring strongly advised. Prepare contingency measures.',
  },
  danger: {
    label: 'DANGER',
    sub: 'Hemodynamic Instability Predicted',
    icon: 'monitor_heart',
    color: '#F87171',
    tw: 'text-red-400',
    alertBg: { bg: 'rgba(248,113,113,.1)', border: '#F87171' },
    tts: p => `Warning. Danger threshold reached. Risk score is ${p} percent. Patient may require intervention. Please assess immediately.`,
    diagIcon: 'emergency',
    diagTitle: '⚠ DANGER — High Risk, Prepare to Intervene',
    diagBody: 'High probability of mean arterial pressure dropping below 65 mmHg within 10 minutes. Intervention preparation advised.',
  },
  critical: {
    label: 'CRITICAL BREACH',
    sub: 'Hypotensive Event Imminent',
    icon: 'emergency',
    color: '#EF4444',
    tw: 'text-red-500',
    alertBg: { bg: 'rgba(239,68,68,.15)', border: '#EF4444' },
    tts: p => `Critical alert. Breach detected. Risk score ${p} percent. Hypotensive event is imminent. Immediate medical attention required. Please take necessary precautions now.`,
    diagIcon: 'crisis_alert',
    diagTitle: '🚨 CRITICAL BREACH — Immediate Action Required',
    diagBody: 'IMMINENT hypotensive event predicted. MAP forecast to breach 65 mmHg. Immediate clinical intervention required.',
  },
};

// ── getRiskState ──────────────────────────────────────────────────────────────
export function getRiskState(score) {
  if (score < 0.40) return 'stable';
  if (score < 0.60) return 'caution';
  if (score < 0.80) return 'danger';
  return 'critical';
}

// ── TTS ───────────────────────────────────────────────────────────────────────
let lastTTSMsg = null;

export function getLastTTSMsg() { return lastTTSMsg; }

export function speak(msg) {
  if (!msg || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  lastTTSMsg = msg;
  const u = new SpeechSynthesisUtterance(msg);
  u.rate = 0.82; u.pitch = 0.9; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const pick = voices.find(v =>
    v.lang.startsWith('en') &&
    ['Samantha', 'Google UK English Female', 'Karen', 'Moira', 'Tessa'].some(n => v.name.includes(n))
  ) || voices.find(v => v.lang.startsWith('en-')) || voices[0];
  if (pick) u.voice = pick;
  window.speechSynthesis.speak(u);
}
