import { useState } from 'react';
import PostPanel from '../components/post/PostPanel';
import PostResults from '../components/post/PostResults';

const API_POST_URL = '/predict_post';

const DEMO_SCORES = [0.88, 0.70, 0.48, 0.20];
const DEMO_INPUTS = {
  age: 68, gender: 1, Creatinine: 2.1, WBC: 12.4, Hemoglobin: 9.8,
  Platelet: 145, Lactate: 3.2, Potassium: 5.1, Sodium: 136, diabetes: 1, hypertension: 1, stroke: 0,
};
let postDemoIdx = -1;

export default function PostView() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (payload) => {
    setLoading(true);
    try {
      const resp = await fetch(API_POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({ detail: `HTTP ${resp.status}` }));
        throw new Error(e.detail);
      }
      const data = await resp.json();
      setResult({ risk_score: data.risk_score, inputs: payload });
    } catch (err) {
      alert(err.message.includes('fetch')
        ? 'Cannot reach backend.\n\nRun: uvicorn intraop_hypotension.server:app --port 8000'
        : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    postDemoIdx = (postDemoIdx + 1) % 4;
    setResult({ risk_score: DEMO_SCORES[postDemoIdx], inputs: DEMO_INPUTS });
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      <PostPanel onAnalyze={handleAnalyze} onDemo={handleDemo} loading={loading} />
      <PostResults data={result} />
    </main>
  );
}
