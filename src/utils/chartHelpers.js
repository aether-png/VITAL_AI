// ── Threshold Line Plugin (65 mmHg) ──────────────────────────────────────────
export const thresholdPlugin = {
  id: 'threshold',
  afterDatasetsDraw(chart) {
    const { ctx: c, scales: { x, y } } = chart;
    const yp = y.getPixelForValue(65);
    if (yp < y.top || yp > y.bottom) return;
    c.save();
    c.beginPath();
    c.strokeStyle = 'rgba(248,113,113,.4)';
    c.lineWidth = 1.5;
    c.setLineDash([6, 5]);
    c.moveTo(x.left, yp); c.lineTo(x.right, yp);
    c.stroke(); c.setLineDash([]);
    c.fillStyle = 'rgba(248,113,113,.6)';
    c.font = 'bold 9px Inter';
    c.fillText('Threshold 65 mmHg', x.left + 8, yp - 5);
    c.restore();
  },
};

// ── Prediction Zone Plugin ────────────────────────────────────────────────────
export function makePredictionPlugin(predictionsArr) {
  return {
    id: 'predZones',
    beforeDatasetsDraw(chart) {
      const { ctx: c, scales: { x, y }, data } = chart;
      const labels = data.labels;
      if (!labels || labels.length < 2) return;
      c.save();
      for (let i = 0; i < labels.length; i++) {
        const pred = predictionsArr[i];
        if (pred === undefined) continue;
        const xPx = x.getPixelForValue(i);
        const halfBar = (x.getPixelForValue(1) - x.getPixelForValue(0)) / 2 || 12;
        if (pred === 1) {
          c.fillStyle = 'rgba(239,68,68,.25)';
          c.fillRect(xPx - halfBar, y.top, halfBar * 2, y.bottom - y.top);
          c.fillStyle = 'rgba(239,68,68,.7)';
          c.fillRect(xPx - halfBar, y.top, halfBar * 2, 3);
          c.fillStyle = 'rgba(239,68,68,.9)';
          c.beginPath(); c.arc(xPx, y.bottom + 10, 5, 0, Math.PI * 2); c.fill();
          c.fillStyle = 'rgba(239,68,68,.5)';
          c.font = 'bold 9px Inter'; c.textAlign = 'center';
          c.fillText('⚠', xPx, y.top + 14);
          c.textAlign = 'start';
        } else {
          c.fillStyle = 'rgba(16,185,129,.06)';
          c.fillRect(xPx - halfBar, y.top, halfBar * 2, y.bottom - y.top);
        }
      }
      c.restore();
    },
  };
}

// ── Base Chart Config ─────────────────────────────────────────────────────────
export function makeChartConfig(plugins = []) {
  return {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'SysBP',     data: [], borderColor: '#A78BFA', borderWidth: 2,   tension: .42, pointRadius: 0, pointHoverRadius: 4 },
        { label: 'MeanBP',    data: [], borderColor: '#F87171', borderWidth: 2.5, tension: .42, pointRadius: 0, pointHoverRadius: 4 },
        { label: 'HeartRate', data: [], borderColor: '#60A5FA', borderWidth: 2,   tension: .42, pointRadius: 0, pointHoverRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 350, easing: 'easeOutCubic' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,16,28,.96)',
          titleColor: '#e2e8f0', bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,.08)', borderWidth: 1, padding: 10,
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,.04)' },
          ticks: { color: '#475569', font: { size: 8, family: 'Inter' }, maxTicksLimit: 8, maxRotation: 0 },
        },
        y: {
          grid: { color: 'rgba(255,255,255,.04)' },
          ticks: { color: '#475569', font: { size: 9, family: 'Inter' } },
          suggestedMin: 30, suggestedMax: 180,
        },
      },
    },
    plugins,
  };
}

// ── Modal Chart Config ────────────────────────────────────────────────────────
export function makeModalChartConfig(labels, sysbp, meanbp, hr, preds, isAI) {
  const plugins = [
    {
      id: 'modalThreshold',
      afterDatasetsDraw(chart) {
        const { ctx: c, scales: { x, y } } = chart;
        const yp = y.getPixelForValue(65);
        if (yp < y.top || yp > y.bottom) return;
        c.save();
        c.beginPath(); c.strokeStyle = 'rgba(248,113,113,.4)'; c.lineWidth = 1.5; c.setLineDash([6, 5]);
        c.moveTo(x.left, yp); c.lineTo(x.right, yp); c.stroke(); c.setLineDash([]);
        c.fillStyle = 'rgba(248,113,113,.6)'; c.font = 'bold 10px Inter';
        c.fillText('Threshold 65 mmHg', x.left + 8, yp - 6); c.restore();
      },
    },
  ];

  if (isAI) {
    plugins.push({
      id: 'modalPredZones',
      beforeDatasetsDraw(chart) {
        const { ctx: c, scales: { x, y }, data } = chart;
        const lbls = data.labels;
        if (!lbls || lbls.length < 2) return;
        c.save();
        for (let i = 0; i < lbls.length; i++) {
          const xPx = x.getPixelForValue(i);
          const halfBar = (x.getPixelForValue(1) - x.getPixelForValue(0)) / 2 || 12;
          if (preds[i] === 1) {
            c.fillStyle = 'rgba(239,68,68,.25)';
            c.fillRect(xPx - halfBar, y.top, halfBar * 2, y.bottom - y.top);
            c.fillStyle = 'rgba(239,68,68,.7)';
            c.fillRect(xPx - halfBar, y.top, halfBar * 2, 3);
            c.fillStyle = 'rgba(239,68,68,.9)';
            c.beginPath(); c.arc(xPx, y.bottom + 10, 5, 0, Math.PI * 2); c.fill();
          } else {
            c.fillStyle = 'rgba(16,185,129,.06)';
            c.fillRect(xPx - halfBar, y.top, halfBar * 2, y.bottom - y.top);
          }
        }
        c.restore();
      },
    });
  }

  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'SysBP',     data: sysbp, borderColor: '#A78BFA', borderWidth: 2.5, tension: .42, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#A78BFA' },
        { label: 'MeanBP',    data: meanbp, borderColor: '#F87171', borderWidth: 3,   tension: .42, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#F87171' },
        { label: 'HeartRate', data: hr,     borderColor: '#60A5FA', borderWidth: 2.5, tension: .42, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#60A5FA' },
      ],
    },
    options: {
      responsive: false, maintainAspectRatio: false,
      animation: { duration: 500 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top', labels: { color: '#94a3b8', font: { size: 13, family: 'Inter' }, usePointStyle: true, padding: 20 } },
        tooltip: { backgroundColor: 'rgba(10,16,28,.96)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,.08)', borderWidth: 1, padding: 14, titleFont: { size: 13 }, bodyFont: { size: 12 } },
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: '#94a3b8', font: { size: 11, family: 'Inter' }, maxRotation: 45, autoSkip: false } },
        y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: '#94a3b8', font: { size: 12, family: 'Inter' } }, suggestedMin: 30, suggestedMax: 180 },
      },
    },
    plugins,
  };
}
