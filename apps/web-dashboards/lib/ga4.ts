// GA4 Data API (server-only). Devuelve vacio si falta config/credenciales -> el caller cae a mock/empty.
// Credenciales: GOOGLE_APPLICATION_CREDENTIALS (ruta al JSON) o GA4_SA_CREDENTIALS (JSON inline).
// Property: GA4_PROPERTY_ID (numerico).
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const PROPERTY = process.env.GA4_PROPERTY_ID;

export type RangeKey = 'today' | '7d' | '28d' | '90d';
export const RANGES: Record<RangeKey, { cur: [string, string]; prev: [string, string]; label: string; bucket: 'hour' | 'date' }> = {
  today: { cur: ['today', 'today'], prev: ['yesterday', 'yesterday'], label: 'Hoy', bucket: 'hour' },
  '7d': { cur: ['7daysAgo', 'today'], prev: ['14daysAgo', '8daysAgo'], label: 'Ultimos 7 dias', bucket: 'date' },
  '28d': { cur: ['28daysAgo', 'today'], prev: ['56daysAgo', '29daysAgo'], label: 'Ultimos 28 dias', bucket: 'date' },
  '90d': { cur: ['90daysAgo', 'today'], prev: ['180daysAgo', '91daysAgo'], label: 'Ultimos 90 dias', bucket: 'date' },
};

let client: BetaAnalyticsDataClient | null = null;
const getClient = (): BetaAnalyticsDataClient | null => {
  if (!PROPERTY) return null;
  if (client) return client;
  const inline = process.env.GA4_SA_CREDENTIALS;
  client = inline ? new BetaAnalyticsDataClient({ credentials: JSON.parse(inline) }) : new BetaAnalyticsDataClient();
  return client;
};
export const ga4Available = () => !!PROPERTY;
const property = () => `properties/${PROPERTY}`;
const dr = (r: [string, string]) => [{ startDate: r[0], endDate: r[1] }];

// Conteo de eventos por nombre -> { eventName: count }
export async function eventCounts(range: [string, string]): Promise<Record<string, number>> {
  const c = getClient(); if (!c) return {};
  const [resp] = await c.runReport({ property: property(), dateRanges: dr(range), dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }] });
  const out: Record<string, number> = {};
  for (const r of resp.rows || []) out[r.dimensionValues?.[0]?.value || ''] = Number(r.metricValues?.[0]?.value || 0);
  return out;
}

// Totales de un rango (sesiones, usuarios, ingresos, compras, engagement)
async function totalsFor(range: [string, string]) {
  const c = getClient(); if (!c) return null;
  const [resp] = await c.runReport({
    property: property(), dateRanges: dr(range),
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'purchaseRevenue' }, { name: 'ecommercePurchases' }, { name: 'userEngagementDuration' }],
  });
  const m = resp.rows?.[0]?.metricValues || [];
  return { sessions: +(m[0]?.value || 0), users: +(m[1]?.value || 0), revenue: +(m[2]?.value || 0), purchases: +(m[3]?.value || 0), engagement: +(m[4]?.value || 0) };
}
// Totales actuales + periodo anterior (para deltas)
export async function totals(key: RangeKey) {
  const r = RANGES[key];
  const [cur, prev] = await Promise.all([totalsFor(r.cur), totalsFor(r.prev)]);
  return { cur, prev };
}

// Top valores de un parametro custom de evento (requiere custom dimension registrada en GA4).
export async function topEventParam(range: [string, string], eventName: string, paramDim: string, limit = 6): Promise<{ label: string; value: number }[]> {
  const c = getClient(); if (!c) return [];
  const [resp] = await c.runReport({
    property: property(), dateRanges: dr(range), limit,
    dimensions: [{ name: `customEvent:${paramDim}` }], metrics: [{ name: 'eventCount' }],
    dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: eventName } } },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });
  return (resp.rows || [])
    .map(r => ({ label: r.dimensionValues?.[0]?.value || '(no set)', value: +(r.metricValues?.[0]?.value || 0) }))
    .filter(r => r.label && r.label !== '(not set)');
}

// Sesiones por dimension (deviceCategory, sessionDefaultChannelGroup, ...) en %
export async function splitBy(range: [string, string], dim: string): Promise<{ label: string; value: number }[]> {
  const c = getClient(); if (!c) return [];
  const [resp] = await c.runReport({
    property: property(), dateRanges: dr(range),
    dimensions: [{ name: dim }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 6,
  });
  const rows = (resp.rows || []).map(r => ({ label: r.dimensionValues?.[0]?.value || '', value: +(r.metricValues?.[0]?.value || 0) }));
  const total = rows.reduce((a, b) => a + b.value, 0) || 1;
  return rows.map(r => ({ label: r.label, value: Math.round((r.value / total) * 100) }));
}

// Serie temporal de ingresos (por dia, o por hora si el rango es "hoy")
export async function revenueSeries(key: RangeKey): Promise<{ labels: string[]; values: number[] }> {
  const c = getClient(); if (!c) return { labels: [], values: [] };
  const r = RANGES[key];
  const [resp] = await c.runReport({
    property: property(), dateRanges: dr(r.cur),
    dimensions: [{ name: r.bucket === 'hour' ? 'hour' : 'date' }], metrics: [{ name: 'purchaseRevenue' }],
    orderBys: [{ dimension: { dimensionName: r.bucket === 'hour' ? 'hour' : 'date' } }],
  });
  const labels: string[] = [], values: number[] = [];
  for (const row of resp.rows || []) {
    const d = row.dimensionValues?.[0]?.value || '';
    labels.push(r.bucket === 'hour' ? `${d}h` : `${d.slice(6, 8)}/${d.slice(4, 6)}`);
    values.push(+(row.metricValues?.[0]?.value || 0));
  }
  return { labels, values };
}

// Serie de actividad (sesiones por dia/hora) para graficar el tiempo
export async function activitySeries(key: RangeKey): Promise<{ labels: string[]; values: number[] }> {
  const c = getClient(); if (!c) return { labels: [], values: [] };
  const r = RANGES[key];
  const [resp] = await c.runReport({
    property: property(), dateRanges: dr(r.cur),
    dimensions: [{ name: r.bucket === 'hour' ? 'hour' : 'date' }], metrics: [{ name: 'sessions' }],
    orderBys: [{ dimension: { dimensionName: r.bucket === 'hour' ? 'hour' : 'date' } }],
  });
  const labels: string[] = [], values: number[] = [];
  for (const row of resp.rows || []) {
    const d = row.dimensionValues?.[0]?.value || '';
    labels.push(r.bucket === 'hour' ? `${d}h` : `${d.slice(6, 8)}/${d.slice(4, 6)}`);
    values.push(+(row.metricValues?.[0]?.value || 0));
  }
  return { labels, values };
}

// --- Realtime (ultimos ~30 min) ---
export async function realtime() {
  const c = getClient(); if (!c) return null;
  try {
    const [[users], [devs], [evs]] = await Promise.all([
      c.runRealtimeReport({ property: property(), metrics: [{ name: 'activeUsers' }] }),
      c.runRealtimeReport({ property: property(), dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'activeUsers' }] }),
      c.runRealtimeReport({ property: property(), dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 6 }),
    ]);
    return {
      activeUsers: +(users.rows?.[0]?.metricValues?.[0]?.value || 0),
      byDevice: (devs.rows || []).map(r => ({ label: r.dimensionValues?.[0]?.value || '', value: +(r.metricValues?.[0]?.value || 0) })),
      topEvents: (evs.rows || []).map(r => ({ label: r.dimensionValues?.[0]?.value || '', value: +(r.metricValues?.[0]?.value || 0) })),
    };
  } catch {
    return null;
  }
}
