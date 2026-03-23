import { useRef, useEffect, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { makeChartConfig, thresholdPlugin, makePredictionPlugin } from '../utils/chartHelpers';

const MAX_VISIBLE = 30;

export function useRealtimePlot({ stdCanvasRef, aiCanvasRef, onBadgeUpdate, onStepUpdate }) {
  const stdChartRef = useRef(null);
  const aiChartRef = useRef(null);
  const animTimerRef = useRef(null);
  const animPredictionsRef = useRef([]);
  const allVitalsRef = useRef([]);

  const stop = useCallback(() => {
    if (animTimerRef.current) { clearInterval(animTimerRef.current); animTimerRef.current = null; }
    if (stdChartRef.current) { stdChartRef.current.destroy(); stdChartRef.current = null; }
    if (aiChartRef.current)  { aiChartRef.current.destroy();  aiChartRef.current  = null; }
    animPredictionsRef.current = [];
  }, []);

  const start = useCallback((vitals) => {
    stop();
    allVitalsRef.current = vitals;
    animPredictionsRef.current = [];

    if (!stdCanvasRef.current || !aiCanvasRef.current) return;

    stdChartRef.current = new Chart(
      stdCanvasRef.current,
      makeChartConfig([thresholdPlugin])
    );
    aiChartRef.current = new Chart(
      aiCanvasRef.current,
      makeChartConfig([thresholdPlugin, makePredictionPlugin(animPredictionsRef.current)])
    );

    let idx = 0;

    function addPoint() {
      if (idx >= vitals.length) {
        clearInterval(animTimerRef.current);
        animTimerRef.current = null;
        onBadgeUpdate?.({ type: 'complete' });
        return;
      }
      const v = vitals[idx];
      const timeLabel = v.time ? v.time.split(' ')[1] || `T${v.step}` : `T${v.step || idx}`;

      [stdChartRef.current, aiChartRef.current].forEach(chart => {
        if (!chart) return;
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(v.SysBP);
        chart.data.datasets[1].data.push(v.MeanBP);
        chart.data.datasets[2].data.push(v.HeartRate);
        if (chart.data.labels.length > MAX_VISIBLE) {
          chart.data.labels.shift();
          chart.data.datasets.forEach(ds => ds.data.shift());
        }
        chart.update();
      });

      animPredictionsRef.current.push(v.prediction || 0);
      if (animPredictionsRef.current.length > MAX_VISIBLE) animPredictionsRef.current.shift();

      onBadgeUpdate?.({ type: 'point', prediction: v.prediction, step: v.step, total: vitals.length });
      onStepUpdate?.({ step: v.step || idx + 1, total: vitals.length });
      idx++;
    }

    addPoint();
    animTimerRef.current = setInterval(addPoint, 800);
  }, [stop, stdCanvasRef, aiCanvasRef, onBadgeUpdate, onStepUpdate]);

  useEffect(() => () => stop(), [stop]);

  return { start, stop, allVitalsRef };
}
