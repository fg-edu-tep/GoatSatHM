/* ═══════════════════════════════════════════
   GOATSat · FINANCIALS PAGE
   js/financials.js
═══════════════════════════════════════════ */

const FCF_DATA = {
  annual: [-1412, -2404.5, -1703.735, -985.298, 682.028, 3600.115, 8078.077, 14261.675, 20686.975, 26870.961],
  cumulative: [-1412, -3816.5, -5520.235, -6505.533, -5823.504, -2223.389, 5854.688, 20116.363, 40803.337, 67674.298],
  labels: ['Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Y9','Y10'],
  phases: [
    { name: 'Phase 1', range: [0,1], color: 'rgba(239,68,68,0.05)' },
    { name: 'Phase 2', range: [2,3], color: 'rgba(249,115,22,0.05)' },
    { name: 'Phase 3', range: [4,6], color: 'rgba(34,197,94,0.05)' },
    { name: 'Phase 4', range: [7,9], color: 'rgba(59,130,246,0.05)' },
  ]
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── FCF Chart ── */
  const canvas = document.getElementById('fcfChart');
  if (canvas) buildChart(canvas);

  /* ── Accordion ── */
  document.querySelectorAll('.accordion__trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion__item');
      // Optionally collapse others:
      // document.querySelectorAll('.accordion__item.open').forEach(el => { if(el!==item) el.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });

  /* ── Phase timeline — update active on scroll ── */
  const cards = [
    { id: 'card-p1', phase: 'p1' },
    { id: 'card-p2', phase: 'p2' },
    { id: 'card-p3', phase: 'p3' },
    { id: 'card-p4', phase: 'p4' },
  ];

  const tlItems = document.querySelectorAll('.phase-tl__item');

  function setActivePhase(phase) {
    tlItems.forEach(el => el.classList.toggle('active', el.dataset.phase === phase));
  }

  if ('IntersectionObserver' in window) {
    const phaseObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const phase = e.target.id.replace('card-', '');
          setActivePhase(phase);
        }
      });
    }, { threshold: 0.35, rootMargin: '-10% 0px -50% 0px' });

    cards.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) phaseObs.observe(el);
    });
  }

  /* ── Timeline click scroll ── */
  tlItems.forEach(item => {
    item.addEventListener('click', () => {
      const phase = item.dataset.phase;
      const card = document.getElementById('card-' + phase);
      if (card) {
        const offset = 130; // nav + kpi bar
        const top = card.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});

/* ── Build Chart ── */
function buildChart(canvas) {
  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  const barColors = FCF_DATA.annual.map(v =>
    v >= 0 ? 'rgba(34,197,94,0.72)' : 'rgba(239,68,68,0.68)'
  );
  const barBorders = FCF_DATA.annual.map(v => v >= 0 ? '#22c55e' : '#ef4444');

  const gridColor  = () => isDark() ? 'rgba(59,130,246,0.07)' : 'rgba(21,87,232,0.07)';
  const tickColor  = () => isDark() ? '#566882' : '#7a93b8';
  const bgColor    = () => isDark() ? 'rgba(6,12,28,0)' : 'rgba(240,245,255,0)';

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: FCF_DATA.labels,
      datasets: [
        {
          type: 'bar',
          label: 'Annual FCF',
          data: FCF_DATA.annual,
          backgroundColor: barColors,
          borderColor: barBorders,
          borderWidth: 1.5,
          borderRadius: 5,
          borderSkipped: false,
          yAxisID: 'yAnnual',
          order: 2,
        },
        {
          type: 'line',
          label: 'Cumulative FCF',
          data: FCF_DATA.cumulative,
          borderColor: '#f5c842',
          backgroundColor: 'rgba(245,200,66,0.05)',
          borderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: FCF_DATA.cumulative.map(v => v >= 0 ? '#22c55e' : '#ef4444'),
          pointBorderColor: '#f5c842',
          pointBorderWidth: 1.5,
          tension: 0.38,
          fill: false,
          yAxisID: 'yCumulative',
          order: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: tickColor(),
            font: { family: "'IBM Plex Mono'", size: 11 },
            usePointStyle: true, pointStyleWidth: 10, boxHeight: 8,
            padding: 16,
          }
        },
        tooltip: {
          backgroundColor: isDark() ? 'rgba(6,12,26,0.95)' : 'rgba(255,255,255,0.96)',
          borderColor: isDark() ? 'rgba(59,130,246,0.3)' : 'rgba(21,87,232,0.2)',
          borderWidth: 1,
          titleColor: isDark() ? '#f0f5ff' : '#0c1b3a',
          bodyColor:  isDark() ? '#a8bcd8' : '#334e79',
          titleFont: { family: "'Syne'", weight: '700', size: 13 },
          bodyFont:  { family: "'IBM Plex Mono'", size: 11 },
          padding: 14,
          callbacks: {
            label(ctx) {
              const v = ctx.raw;
              const abs = Math.abs(v / 1000);
              const sign = v >= 0 ? '+' : '−';
              return `  ${ctx.dataset.label}: ${sign}$${abs.toFixed(2)}M`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor() },
          ticks: { color: tickColor(), font: { family: "'IBM Plex Mono'", size: 11 } },
          border: { color: gridColor() }
        },
        yAnnual: {
          position: 'left',
          title: {
            display: true, text: 'Annual FCF (USD M)',
            color: tickColor(), font: { family: "'IBM Plex Mono'", size: 10 }
          },
          grid: { color: gridColor() },
          border: { color: gridColor(), dash: [4,4] },
          ticks: {
            color: tickColor(), font: { family: "'IBM Plex Mono'", size: 10 },
            callback: v => {
              const abs = Math.abs(v/1000);
              return v >= 0 ? `+$${abs.toFixed(0)}M` : `−$${abs.toFixed(0)}M`;
            }
          }
        },
        yCumulative: {
          position: 'right',
          title: {
            display: true, text: 'Cumulative FCF (USD M)',
            color: '#f5c842', font: { family: "'IBM Plex Mono'", size: 10 }
          },
          grid: { drawOnChartArea: false },
          border: { color: 'rgba(245,200,66,0.2)' },
          ticks: {
            color: '#c8a828', font: { family: "'IBM Plex Mono'", size: 10 },
            callback: v => {
              const abs = Math.abs(v/1000);
              return v >= 0 ? `+$${abs.toFixed(0)}M` : `−$${abs.toFixed(0)}M`;
            }
          }
        }
      }
    }
  });

  // Update chart colors on theme change
  const observer = new MutationObserver(() => {
    chart.options.plugins.legend.labels.color = tickColor();
    chart.options.scales.x.grid.color = gridColor();
    chart.options.scales.x.ticks.color = tickColor();
    chart.options.scales.yAnnual.grid.color = gridColor();
    chart.options.scales.yAnnual.ticks.color = tickColor();
    chart.options.scales.yAnnual.title.color = tickColor();
    chart.update('none');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
