import { useState } from 'react';
import IntraPanel from '../components/intra/IntraPanel';
import IntraResults from '../components/intra/IntraResults';

const API_URL = '/predict';

const DEMO_SCORES = [0.91, 0.72, 0.51, 0.25];
let demoIdx = -1;

function buildDemoData(score) {
  const vitals = Array.from({ length: 30 }, (_, i) => {
    const d = score > .7 ? (i / 29) * 35 : score > .5 ? (i / 29) * 15 : 0;
    return {
      step: i + 1,
      time: `2023-01-01 ${String(Math.floor(i / 2) + 8).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}:00`,
      HeartRate: Math.round(68 + d * 2.2 + Math.random() * 4),
      MeanBP: Math.round(92 - d + Math.random() * 3),
      SysBP: Math.round(125 - d * 1.5 + Math.random() * 4),
      prediction: (score > .5 && i >= 15) ? (i % 3 !== 0 ? 1 : 0) : 0,
    };
  });
  return {
    patient_id: `DEMO-${demoIdx + 1}`,
    occurrence_time: new Date().toISOString().replace('T', ' ').slice(0, 19),
    filename_processed: 'demo.csv',
    risk_score: score,
    vitals,
  };
}

export default function IntraView() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (file, patientId) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (patientId) fd.append('patient_id', patientId);
      const resp = await fetch(API_URL, { method: 'POST', body: fd });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({ detail: `HTTP ${resp.status}` }));
        throw new Error(e.detail);
      }
      setResult(await resp.json());
    } catch (err) {
      alert(err.message.includes('fetch')
        ? 'Cannot reach backend.\n\nRun: uvicorn intraop_hypotension.server:app --port 8000'
        : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoIdx = (demoIdx + 1) % 4;
    setResult(buildDemoData(DEMO_SCORES[demoIdx]));
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      <IntraPanel onAnalyze={handleAnalyze} onDemo={handleDemo} loading={loading} />
      <IntraResults data={result} />
    </main>
  );
}
