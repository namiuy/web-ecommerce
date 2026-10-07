// Capa de datos del panel. Server-only. Datos reales via GA4 Data API; si no hay property -> mock (demo).
import { ga4Available, eventCounts, totals, topEventParam, splitBy, revenueSeries, realtime, RANGES, RangeKey } from './ga4';

export type Kpi = { label: string; value: string; deltaPct?: number; event?: string; alert?: boolean; invert?: boolean };
export type FunnelStep = { label: string; event: string; count: number; pct: number };
export type BarRow = { label: string; value: number; tone?: 'blue' | 'violet' | 'bad' | 'ok' };
export type TableRow = { label: string; a: string; b?: string; tone?: 'ok' | 'bad' };
export type SliceRow = { label: string; pct: number; color: string };
export type Series = { labels: string[]; values: number[] };

export type Dashboard = {
  source: 'mock' | 'ga4';
  rangeKey: RangeKey;
  range: string;
  property: string;
  kpis: Kpi[];
  funnel: FunnelStep[];
  revenue: Series;
  paymentMix: BarRow[];
  channels: BarRow[];
  topSearches: BarRow[];
  noResults: BarRow[];
  searchMix: SliceRow[];
  topViewed: TableRow[];
  topAdded: TableRow[];
  topPurchased: TableRow[];
  leads: Kpi[];
  chat: BarRow[];
  account: TableRow[];
  devices: BarRow[];
};

export type Realtime = { activeUsers: number; byDevice: BarRow[]; topEvents: BarRow[] } | null;

const SEARCH_COLORS = ['#4c8dff', '#a06bff', '#f6c343', '#38c172'];

const mock: Dashboard = {
  source: 'mock', rangeKey: '28d', range: 'Ultimos 28 dias', property: 'G-YB07PJR6WK',
  kpis: [
    { label: 'Sesiones', value: '12.480', deltaPct: 8.2 },
    { label: 'Usuarios', value: '9.130', deltaPct: 6.1 },
    { label: 'Tasa de conversion', value: '1,9%', deltaPct: -0.3, event: 'purchase / sesiones' },
    { label: 'Ingresos', value: '$ 486.200', deltaPct: 11, event: 'purchase.value' },
    { label: 'Ticket promedio', value: '$ 2.050', deltaPct: 3 },
    { label: 'Carritos abandonados', value: '63%', event: 'add_to_cart sin purchase', alert: true },
    { label: 'Leads', value: '238', deltaPct: 14, event: 'generate_lead' },
    { label: 'Busquedas sin resultado', value: '412', deltaPct: 9, invert: true, event: 'search_no_results', alert: true },
  ],
  funnel: [
    { label: 'Ve producto', event: 'view_item', count: 8400, pct: 100 },
    { label: 'Agrega al carrito', event: 'add_to_cart', count: 2520, pct: 30 },
    { label: 'Inicia checkout', event: 'begin_checkout', count: 1180, pct: 14 },
    { label: 'Elige envio', event: 'add_shipping_info', count: 940, pct: 11 },
    { label: 'Elige pago', event: 'add_payment_info', count: 610, pct: 7 },
    { label: 'Compra', event: 'purchase', count: 238, pct: 3 },
  ],
  revenue: { labels: ['01/09', '05/09', '10/09', '15/09', '20/09', '25/09', '30/09'], values: [12000, 18000, 15000, 24000, 21000, 30000, 27000] },
  paymentMix: [{ label: 'Transferencia', value: 58, tone: 'blue' }, { label: 'PayPal', value: 27, tone: 'violet' }, { label: 'Otros', value: 15, tone: 'ok' }],
  channels: [{ label: 'Organico', value: 44, tone: 'blue' }, { label: 'Directo', value: 31, tone: 'violet' }, { label: 'Social', value: 18, tone: 'ok' }, { label: 'Referral', value: 7, tone: 'bad' }],
  topSearches: [{ label: 'taladro', value: 820 }, { label: 'amoladora', value: 640 }, { label: 'compresor', value: 500 }, { label: 'soldadora', value: 385 }, { label: 'generador', value: 290 }],
  noResults: [{ label: 'hidrolavadora 200bar', value: 96, tone: 'bad' }, { label: 'motosierra 25"', value: 71, tone: 'bad' }, { label: 'torno cnc', value: 58, tone: 'bad' }, { label: 'plasma 60a', value: 40, tone: 'bad' }],
  searchMix: [{ label: 'Texto libre', pct: 62, color: SEARCH_COLORS[0] }, { label: 'Por categoria', pct: 26, color: SEARCH_COLORS[1] }, { label: 'Por marca', pct: 12, color: SEARCH_COLORS[2] }],
  topViewed: [{ label: 'Taladro percutor 800W', a: '1.240' }, { label: 'Amoladora 4.5" 900W', a: '980' }, { label: 'Compresor 50L', a: '760' }, { label: 'Soldadora inverter 200A', a: '610' }],
  topAdded: [{ label: 'Taladro percutor 800W', a: '310', b: '41%', tone: 'ok' }, { label: 'Amoladora 4.5" 900W', a: '280', b: '23%', tone: 'ok' }, { label: 'Set brocas', a: '190', b: '18%' }, { label: 'Compresor 50L', a: '120', b: '12%', tone: 'bad' }],
  topPurchased: [{ label: 'Taladro percutor 800W', a: '140', b: '$ 420.000' }, { label: 'Set brocas', a: '90', b: '$ 81.000' }, { label: 'Soldadora inverter 200A', a: '55', b: '$ 660.000' }, { label: 'Amoladora 4.5" 900W', a: '30', b: '$ 96.000' }],
  leads: [
    { label: 'Cotizaciones', value: '112', event: 'quote' }, { label: 'Contacto', value: '48', event: 'contact_form' },
    { label: 'WhatsApp producto', value: '61', event: 'whatsapp_product' }, { label: 'WhatsApp flotante', value: '17', event: 'whatsapp_floating' },
  ],
  chat: [{ label: 'Aperturas', value: 540, tone: 'violet' }, { label: 'Mensajes', value: 410, tone: 'violet' }, { label: 'Derivo a busqueda', value: 185, tone: 'violet' }],
  account: [{ label: 'Logins', a: '1.320', b: 'password/google' }, { label: 'Registros', a: '214', b: 'sign_up', tone: 'ok' }, { label: 'Newsletter', a: '96', b: 'subscribe' }],
  devices: [{ label: 'Mobile', value: 68, tone: 'blue' }, { label: 'Desktop', value: 28, tone: 'violet' }, { label: 'Tablet', value: 4, tone: 'ok' }],
};

const fmt = (x: number) => Math.round(x).toLocaleString('es-UY');
const money = (x: number) => '$ ' + Math.round(x).toLocaleString('es-UY');
const delta = (cur: number, prev: number) => (prev ? Math.round(((cur - prev) / prev) * 1000) / 10 : undefined);

export async function getDashboardData(rangeKey: RangeKey = '28d'): Promise<Dashboard> {
  if (!ga4Available()) return { ...mock, rangeKey, range: RANGES[rangeKey].label };
  const r = RANGES[rangeKey];
  try {
    const [ev, evPrev, tot, rev, searches, noRes, payMix, leadSrc, devices, channels] = await Promise.all([
      eventCounts(r.cur), eventCounts(r.prev), totals(rangeKey), revenueSeries(rangeKey),
      topEventParam(r.cur, 'search', 'search_term').catch(() => []),
      topEventParam(r.cur, 'search_no_results', 'search_term').catch(() => []),
      topEventParam(r.cur, 'add_payment_info', 'payment_type').catch(() => []),
      topEventParam(r.cur, 'generate_lead', 'lead_source', 10).catch(() => []),
      splitBy(r.cur, 'deviceCategory').catch(() => []),
      splitBy(r.cur, 'sessionDefaultChannelGroup').catch(() => []),
    ]);
    const n = (k: string) => ev[k] || 0, np = (k: string) => evPrev[k] || 0;
    const C = tot.cur, P = tot.prev;
    const purchases = C?.purchases || n('purchase'), pPurch = P?.purchases || np('purchase');
    const sessions = C?.sessions || 0, revenue = C?.revenue || 0;
    const viewItem = n('view_item'), addCart = n('add_to_cart'), beginCk = n('begin_checkout'), ship = n('add_shipping_info'), pay = n('add_payment_info');
    const conv = sessions ? purchases / sessions * 100 : 0, pConv = P?.sessions ? pPurch / P.sessions * 100 : 0;
    const ticket = purchases ? revenue / purchases : 0, pTicket = pPurch ? (P?.revenue || 0) / pPurch : 0;
    const leadBy = (s: string) => leadSrc.find(l => l.label === s)?.value ?? 0;
    const smRaw = [
      { label: 'Texto libre', value: n('search') }, { label: 'Por vehiculo', value: n('search_by_vehicle') },
      { label: 'Por codigo', value: n('search_by_code') }, { label: 'Por medidas', value: n('search_by_dimensions') },
    ];
    const smTotal = smRaw.reduce((a, b) => a + b.value, 0);

    return {
      source: 'ga4', rangeKey, range: r.label, property: `GA4 ${process.env.GA4_PROPERTY_ID}`,
      kpis: [
        { label: 'Sesiones', value: fmt(sessions), deltaPct: delta(sessions, P?.sessions || 0) },
        { label: 'Usuarios', value: fmt(C?.users || 0), deltaPct: delta(C?.users || 0, P?.users || 0) },
        { label: 'Tasa de conversion', value: conv.toFixed(1) + '%', deltaPct: delta(conv, pConv), event: 'purchase / sesiones' },
        { label: 'Ingresos', value: money(revenue), deltaPct: delta(revenue, P?.revenue || 0), event: 'purchase.value' },
        { label: 'Ticket promedio', value: purchases ? money(ticket) : '-', deltaPct: delta(ticket, pTicket) },
        { label: 'Carritos abandonados', value: addCart ? (100 - Math.round(purchases / addCart * 100)) + '%' : '-', event: 'add_to_cart sin purchase', alert: true },
        { label: 'Leads', value: fmt(n('generate_lead')), deltaPct: delta(n('generate_lead'), np('generate_lead')), event: 'generate_lead' },
        { label: 'Busquedas sin resultado', value: fmt(n('search_no_results')), deltaPct: delta(n('search_no_results'), np('search_no_results')), invert: true, event: 'search_no_results', alert: true },
      ],
      funnel: [
        { label: 'Ve producto', event: 'view_item', count: viewItem, pct: 100 },
        { label: 'Agrega al carrito', event: 'add_to_cart', count: addCart, pct: viewItem ? Math.round(addCart / viewItem * 100) : 0 },
        { label: 'Inicia checkout', event: 'begin_checkout', count: beginCk, pct: viewItem ? Math.round(beginCk / viewItem * 100) : 0 },
        { label: 'Elige envio', event: 'add_shipping_info', count: ship, pct: viewItem ? Math.round(ship / viewItem * 100) : 0 },
        { label: 'Elige pago', event: 'add_payment_info', count: pay, pct: viewItem ? Math.round(pay / viewItem * 100) : 0 },
        { label: 'Compra', event: 'purchase', count: purchases, pct: viewItem ? Math.round(purchases / viewItem * 100) : 0 },
      ],
      revenue: rev,
      paymentMix: payMix.length ? payMix.map((p, i) => ({ label: p.label, value: p.value, tone: (['blue', 'violet', 'ok', 'bad'] as const)[i % 4] })) : [],
      channels: channels.length ? channels.map((p, i) => ({ label: p.label, value: p.value, tone: (['blue', 'violet', 'ok', 'bad'] as const)[i % 4] })) : [],
      topSearches: searches,
      noResults: noRes.map(r => ({ ...r, tone: 'bad' as const })),
      searchMix: smTotal > 0 ? smRaw.filter(s => s.value > 0).map((s, i) => ({ label: s.label, pct: Math.round(s.value / smTotal * 100), color: SEARCH_COLORS[i % 4] })) : [],
      topViewed: [], topAdded: [], topPurchased: [], // item-scoped: pendiente flujo products
      leads: [
        { label: 'Cotizaciones', value: fmt(leadBy('quote')), event: 'quote' },
        { label: 'Contacto', value: fmt(leadBy('contact_form')), event: 'contact_form' },
        { label: 'WhatsApp producto', value: fmt(leadBy('whatsapp_product')), event: 'whatsapp_product' },
        { label: 'WhatsApp flotante', value: fmt(leadBy('whatsapp_floating')), event: 'whatsapp_floating' },
      ],
      chat: [
        { label: 'Aperturas', value: n('chat_open'), tone: 'violet' },
        { label: 'Mensajes', value: n('chat_message_sent'), tone: 'violet' },
        { label: 'Derivo a busqueda', value: n('chat_product_search'), tone: 'violet' },
      ],
      account: [
        { label: 'Logins', a: fmt(n('login')) }, { label: 'Registros', a: fmt(n('sign_up')), b: 'sign_up', tone: 'ok' },
        { label: 'Newsletter', a: fmt(n('newsletter_subscribe')), b: 'subscribe' },
      ],
      devices: devices.length ? devices.map((d, i) => ({ label: d.label, value: d.value, tone: (['blue', 'violet', 'ok'] as const)[i % 3] })) : [],
    };
  } catch (e) {
    return { ...mock, rangeKey, range: r.label };
  }
}

export async function getRealtime(): Promise<Realtime> {
  if (!ga4Available()) return { activeUsers: 7, byDevice: [{ label: 'mobile', value: 5 }, { label: 'desktop', value: 2 }], topEvents: [{ label: 'page_view', value: 18 }, { label: 'view_item', value: 6 }] };
  return realtime();
}
