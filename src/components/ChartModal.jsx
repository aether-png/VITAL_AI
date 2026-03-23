import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { makeModalChartConfig } from '../utils/chartHelpers';

export default function ChartModal({ isOpen, onClose, vitals, mode }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !vitals?.length) return;
    setReady(false);
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, [isOpen, vitals]);

  useEffect(() => {
    if (!ready || !isOpen || !vitals?.length || !containerRef.current) return;

    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const isAI = mode === 'ai';
    const pxPerPoint = 60;
    const totalWidth = Math.max(window.innerWidth * 0.9, vitals.length * pxPerPoint);
    const dpr = window.devicePixelRatio || 1;
    const containerEl = containerRef.current;
    containerEl.style.width = totalWidth + 'px';

    const scrollEl = containerEl.parentElement;
    const canvasHeight = Math.max(400, scrollEl.clientHeight - 60);

    containerEl.innerHTML = '<canvas id="modalCanvas"></canvas>';
    const canvas = containerEl.querySelector('#modalCanvas');
    canvas.width = totalWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = totalWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const labels  = vitals.map(v => v.time ? v.time.split(' ')[1] || `T${v.step}` : `T${v.step}`);
    const sysbp   = vitals.map(v => v.SysBP);
    const meanbp  = vitals.map(v => v.MeanBP);
    const hr      = vitals.map(v => v.HeartRate);
    const preds   = vitals.map(v => v.prediction || 0);

    chartRef.current = new Chart(ctx, makeModalChartConfig(labels, sysbp, meanbp, hr, preds, isAI));

    return () => {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, [ready, isOpen, vitals, mode]);

  if (!isOpen) return null;

  return (
    <div
      className="chart-modal-overlay open"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="chart-modal-header">
        <div>
          <h2 className="text-lg font-bold text-white">
            {mode === 'ai' ? 'AI-Enhanced Monitoring — Full Timeline' : 'Standard Monitoring — Full Timeline'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {vitals?.length} data points · Scroll horizontally to navigate
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      <div className="chart-modal-scroll">
        <div className="chart-modal-inner" ref={containerRef} />
      </div>
      <div className="chart-modal-hint">← Scroll or swipe horizontally to explore the full timeline →</div>
    </div>
  );
}
