import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Tooltip, Filler, Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Filler, Legend);
ChartJS.defaults.color = '#8a93a2';
ChartJS.defaults.font.family = '-apple-system,Segoe UI,Roboto,Arial,sans-serif';

const grid = { color: 'rgba(255,255,255,0.05)' };
const noLegend = { legend: { display: false } };

export function RevenueChart({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <Line
      data={{
        labels,
        datasets: [{
          data: values, borderColor: '#00b0e7', borderWidth: 2.5, tension: 0.4,
          fill: true, pointRadius: 0, pointHoverRadius: 4,
          backgroundColor: (ctx: any) => {
            const { ctx: c, chartArea } = ctx.chart; if (!chartArea) return 'rgba(0,176,231,0.1)';
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(0,176,231,0.35)'); g.addColorStop(1, 'rgba(0,176,231,0)'); return g;
          },
        }],
      }}
      options={{
        responsive: true, maintainAspectRatio: false, plugins: noLegend as any,
        scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 7 } }, y: { grid, ticks: { callback: (v: any) => '$' + (v >= 1000 ? (v / 1000) + 'k' : v) }, beginAtZero: true } },
      }}
    />
  );
}

export function FunnelChart({ steps }: { steps: { label: string; count: number; pct: number }[] }) {
  return (
    <Bar
      data={{
        labels: steps.map(s => s.label),
        datasets: [{ data: steps.map(s => s.count), backgroundColor: steps.map((_, i) => ['#00b0e7', '#2cc0ee', '#58cff2', '#86ddf6', '#b3eafa', '#38c172'][i] || '#00b0e7'), borderRadius: 6, barThickness: 26 }],
      }}
      options={{
        indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => `${c.raw.toLocaleString('es-UY')} (${steps[c.dataIndex].pct}%)` } } } as any,
        scales: { x: { grid, beginAtZero: true }, y: { grid: { display: false } } },
      }}
    />
  );
}

export function ActivityChart({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <Bar
      data={{ labels, datasets: [{ data: values, backgroundColor: 'rgba(0,176,231,0.55)', hoverBackgroundColor: '#00b0e7', borderRadius: 4, barThickness: 'flex' as any, maxBarThickness: 22 }] }}
      options={{
        responsive: true, maintainAspectRatio: false, plugins: noLegend as any,
        scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { grid, beginAtZero: true, ticks: { precision: 0 } } },
      }}
    />
  );
}

export function MixDoughnut({ rows }: { rows: { label: string; value: number }[] }) {
  const palette = ['#4c8dff', '#a06bff', '#f6c343', '#38c172', '#ff6a3d', '#e3564a'];
  return (
    <Doughnut
      data={{ labels: rows.map(r => r.label), datasets: [{ data: rows.map(r => r.value), backgroundColor: rows.map((_, i) => palette[i % palette.length]), borderColor: '#171b22', borderWidth: 2 }] }}
      options={{ responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, padding: 10, font: { size: 11 } } } } as any }}
    />
  );
}
