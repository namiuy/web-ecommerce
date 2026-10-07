// GA4 Data API (server-only). Devuelve null si falta config/credenciales -> el caller cae a mock.
// Credenciales: GOOGLE_APPLICATION_CREDENTIALS (ruta al JSON) o GA4_SA_CREDENTIALS (JSON inline).
// Property: GA4_PROPERTY_ID (numerico, NO el G-XXXX que es el measurement id del stream).
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const PROPERTY = process.env.GA4_PROPERTY_ID;
const DATE_RANGE = [{ startDate: '28daysAgo', endDate: 'today' }];

let client: BetaAnalyticsDataClient | null = null;
const getClient = (): BetaAnalyticsDataClient | null => {
  if (!PROPERTY) return null;
  if (client) return client;
  const inline = process.env.GA4_SA_CREDENTIALS;
  client = inline
    ? new BetaAnalyticsDataClient({ credentials: JSON.parse(inline) })
    : new BetaAnalyticsDataClient(); // usa GOOGLE_APPLICATION_CREDENTIALS
  return client;
};

export const ga4Available = () => !!PROPERTY;

const property = () => `properties/${PROPERTY}`;

// Conteo de eventos por nombre -> { eventName: count }
export async function eventCounts(): Promise<Record<string, number>> {
  const c = getClient(); if (!c) return {};
  const [resp] = await c.runReport({
    property: property(), dateRanges: DATE_RANGE,
    dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }],
  });
  const out: Record<string, number> = {};
  for (const r of resp.rows || []) out[r.dimensionValues?.[0]?.value || ''] = Number(r.metricValues?.[0]?.value || 0);
  return out;
}

// Totales de sesion/usuarios/ingresos
export async function totals() {
  const c = getClient(); if (!c) return null;
  const [resp] = await c.runReport({
    property: property(), dateRanges: DATE_RANGE,
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'purchaseRevenue' }, { name: 'ecommercePurchases' }],
  });
  const m = resp.rows?.[0]?.metricValues || [];
  return { sessions: Number(m[0]?.value || 0), users: Number(m[1]?.value || 0), revenue: Number(m[2]?.value || 0), purchases: Number(m[3]?.value || 0) };
}

// Top valores de un parametro custom de evento (requiere custom dimension registrada en GA4).
// Devuelve [] si la dimension no existe (lo captura el caller).
export async function topEventParam(eventName: string, paramDim: string, limit = 6): Promise<{ label: string; value: number }[]> {
  const c = getClient(); if (!c) return [];
  const [resp] = await c.runReport({
    property: property(), dateRanges: DATE_RANGE, limit,
    dimensions: [{ name: `customEvent:${paramDim}` }], metrics: [{ name: 'eventCount' }],
    dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: eventName } } },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });
  return (resp.rows || [])
    .map(r => ({ label: r.dimensionValues?.[0]?.value || '(no set)', value: Number(r.metricValues?.[0]?.value || 0) }))
    .filter(r => r.label && r.label !== '(not set)');
}

// Sesiones por categoria de dispositivo
export async function deviceSplit(): Promise<{ label: string; value: number }[]> {
  const c = getClient(); if (!c) return [];
  const [resp] = await c.runReport({
    property: property(), dateRanges: DATE_RANGE,
    dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });
  const rows = (resp.rows || []).map(r => ({ label: r.dimensionValues?.[0]?.value || '', value: Number(r.metricValues?.[0]?.value || 0) }));
  const total = rows.reduce((a, b) => a + b.value, 0) || 1;
  return rows.map(r => ({ label: r.label, value: Math.round((r.value / total) * 100) }));
}
