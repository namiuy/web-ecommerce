// Capa de datos del panel. Server-only: la clave del service account NUNCA va al cliente.
// Hoy devuelve datos de ejemplo (source: 'mock'). Para datos reales enchufar la GA4 Data API:
//
//   1) npm i @google-analytics/data
//   2) env server-only: GA4_PROPERTY_ID (numerico) + GOOGLE_APPLICATION_CREDENTIALS (ruta al JSON)
//      o GA4_SA_CREDENTIALS (JSON inline)
//   3) reemplazar getDashboardData() por llamadas runReport():
//        const client = new BetaAnalyticsDataClient();
//        const [resp] = await client.runReport({ property: `properties/${GA4_PROPERTY_ID}`,
//          dateRanges:[{startDate:'28daysAgo',endDate:'today'}],
//          dimensions:[{name:'searchTerm'}], metrics:[{name:'eventCount'}], ... });
//      El filtro de trafico interno ya lo resuelve el gate del front (vendedor/admin no emiten eventos).

export type Kpi = { label: string; value: string; delta?: string; trend?: 'up' | 'down'; event?: string; alert?: boolean };
export type FunnelStep = { label: string; event: string; count: number; pct: number; drop?: number };
export type BarRow = { label: string; value: number; tone?: 'blue' | 'violet' | 'bad' };
export type TableRow = { label: string; a: string; b?: string; tone?: 'ok' | 'bad' };
export type SliceRow = { label: string; pct: number; color: string };

export type Dashboard = {
  source: 'mock' | 'ga4';
  range: string;
  property: string;
  kpis: Kpi[];
  funnel: FunnelStep[];
  paymentMix: BarRow[];
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
  revenueSeries: number[];
};

const mock: Dashboard = {
  source: 'mock',
  range: 'Ultimos 28 dias',
  property: process.env.GA4_PROPERTY_ID ? `GA4 ${process.env.GA4_PROPERTY_ID}` : 'G-YB07PJR6WK',
  kpis: [
    { label: 'Sesiones', value: '12.480', delta: '8,2% vs ant.', trend: 'up' },
    { label: 'Usuarios', value: '9.130', delta: '6,1%', trend: 'up' },
    { label: 'Tasa de conversion', value: '1,9%', delta: '0,3 pts', trend: 'down', event: 'purchase / sesiones' },
    { label: 'Ingresos', value: '$ 486.200', delta: '11%', trend: 'up', event: 'purchase.value' },
    { label: 'Ticket promedio', value: '$ 2.050', delta: '3%', trend: 'up' },
    { label: 'Carritos abandonados', value: '63%', delta: 'alto', trend: 'down', event: 'add_to_cart sin purchase', alert: true },
    { label: 'Leads generados', value: '238', delta: '14%', trend: 'up', event: 'generate_lead' },
    { label: 'Busquedas sin resultado', value: '412', delta: 'revisar catalogo', trend: 'down', event: 'search_no_results', alert: true },
  ],
  funnel: [
    { label: 'view_item', event: 'view_item', count: 8400, pct: 100 },
    { label: 'add_to_cart', event: 'add_to_cart', count: 2520, pct: 30, drop: 70 },
    { label: 'begin_checkout', event: 'begin_checkout', count: 1180, pct: 14, drop: 53 },
    { label: 'add_shipping_info', event: 'add_shipping_info', count: 940, pct: 11, drop: 20 },
    { label: 'add_payment_info', event: 'add_payment_info', count: 610, pct: 7, drop: 35 },
    { label: 'purchase', event: 'purchase', count: 238, pct: 3, drop: 61 },
  ],
  paymentMix: [
    { label: 'Transferencia', value: 58, tone: 'blue' },
    { label: 'PayPal', value: 27, tone: 'violet' },
    { label: 'Otros', value: 15, tone: 'blue' },
  ],
  topSearches: [
    { label: 'pastilla freno', value: 820 }, { label: 'amortiguador', value: 640 },
    { label: 'filtro aceite', value: 500 }, { label: 'correa distribucion', value: 385 },
    { label: 'bateria', value: 290 },
  ],
  noResults: [
    { label: 'turbo hilux', value: 96, tone: 'bad' }, { label: 'sensor abs', value: 71, tone: 'bad' },
    { label: 'bomba agua ranger', value: 58, tone: 'bad' }, { label: 'cristal retrovisor', value: 40, tone: 'bad' },
  ],
  searchMix: [
    { label: 'Texto libre', pct: 46, color: 'var(--blue)' },
    { label: 'Por vehiculo', pct: 30, color: 'var(--violet)' },
    { label: 'Por codigo', pct: 16, color: 'var(--warn)' },
    { label: 'Por medidas', pct: 8, color: 'var(--ok)' },
  ],
  topViewed: [
    { label: 'Pastilla freno del. Corolla', a: '1.240' }, { label: 'Amortiguador tras. Hilux', a: '980' },
    { label: 'Filtro aceite universal', a: '760' }, { label: 'Kit correa Ranger', a: '610' },
  ],
  topAdded: [
    { label: 'Filtro aceite universal', a: '310', b: '41%', tone: 'ok' },
    { label: 'Pastilla freno del. Corolla', a: '280', b: '23%', tone: 'ok' },
    { label: 'Bateria 12V 60Ah', a: '190', b: '18%' },
    { label: 'Amortiguador tras. Hilux', a: '120', b: '12%', tone: 'bad' },
  ],
  topPurchased: [
    { label: 'Filtro aceite universal', a: '140', b: '$ 42.000' },
    { label: 'Pastilla freno del. Corolla', a: '90', b: '$ 81.000' },
    { label: 'Bateria 12V 60Ah', a: '55', b: '$ 165.000' },
    { label: 'Kit correa Ranger', a: '30', b: '$ 96.000' },
  ],
  leads: [
    { label: 'Cotizaciones', value: '112', event: 'generate_lead: quote' },
    { label: 'Form de contacto', value: '48', event: 'generate_lead: contact_form' },
    { label: 'WhatsApp producto', value: '61', event: 'generate_lead: whatsapp_product' },
    { label: 'WhatsApp flotante', value: '17', event: 'generate_lead: whatsapp_floating' },
  ],
  chat: [
    { label: 'Aperturas', value: 540, tone: 'violet' },
    { label: 'Mensajes enviados', value: 410, tone: 'violet' },
    { label: 'Derivo a busqueda', value: 185, tone: 'violet' },
  ],
  account: [
    { label: 'Logins', a: '1.320', b: 'password 82% / google 18%' },
    { label: 'Registros', a: '214', b: 'sign_up', tone: 'ok' },
    { label: 'Altas newsletter', a: '96', b: 'newsletter_subscribe' },
  ],
  devices: [
    { label: 'Mobile', value: 68, tone: 'blue' }, { label: 'Desktop', value: 28, tone: 'blue' },
    { label: 'Tablet', value: 4, tone: 'blue' },
  ],
  revenueSeries: [110, 95, 120, 80, 130, 90, 140, 100, 160, 120, 180, 150, 200, 170],
};

import { ga4Available, eventCounts, totals, topEventParam, deviceSplit, dailyRevenue } from './ga4';

const toPct = (rows: { label: string; value: number }[], tone?: BarRow['tone']): BarRow[] => {
  const total = rows.reduce((a, b) => a + b.value, 0) || 1;
  return rows.map(r => ({ label: r.label, value: Math.round((r.value / total) * 100), tone }));
};

export async function getDashboardData(): Promise<Dashboard> {
  if (!ga4Available()) return mock; // sin GA4_PROPERTY_ID -> datos de ejemplo
  try {
    const [ev, tot, searches, noRes, payMix, leadSrc, devices, revSeries] = await Promise.all([
      eventCounts(),
      totals(),
      topEventParam('search', 'search_term').catch(() => []),
      topEventParam('search_no_results', 'search_term').catch(() => []),
      topEventParam('add_payment_info', 'payment_type').catch(() => []),
      topEventParam('generate_lead', 'lead_source', 10).catch(() => []),
      deviceSplit().catch(() => []),
      dailyRevenue().catch(() => []),
    ]);
    const n = (k: string) => ev[k] || 0;
    const fmt = (x: number) => x.toLocaleString('es-UY');
    const money = (x: number) => '$ ' + Math.round(x).toLocaleString('es-UY');
    const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

    const sessions = tot?.sessions || 0, users = tot?.users || 0, revenue = tot?.revenue || 0;
    const purchases = tot?.purchases || n('purchase');
    const viewItem = n('view_item'), addCart = n('add_to_cart'), beginCk = n('begin_checkout'), ship = n('add_shipping_info'), pay = n('add_payment_info');
    const leadBy = (src: string) => leadSrc.find(l => l.label === src)?.value ?? 0;

    const searchMixRaw = [
      { label: 'Texto libre', value: n('search'), color: 'var(--blue)' },
      { label: 'Por vehiculo', value: n('search_by_vehicle'), color: 'var(--violet)' },
      { label: 'Por codigo', value: n('search_by_code'), color: 'var(--warn)' },
      { label: 'Por medidas', value: n('search_by_dimensions'), color: 'var(--ok)' },
    ];
    const smTotal = searchMixRaw.reduce((a, b) => a + b.value, 0) || 1;

    return {
      source: 'ga4',
      range: 'Ultimos 28 dias',
      property: `GA4 ${process.env.GA4_PROPERTY_ID}`,
      kpis: [
        { label: 'Sesiones', value: fmt(sessions) },
        { label: 'Usuarios', value: fmt(users) },
        { label: 'Tasa de conversion', value: (sessions ? (purchases / sessions * 100).toFixed(1) : '0') + '%', event: 'purchase / sesiones' },
        { label: 'Ingresos', value: money(revenue), event: 'purchase.value' },
        { label: 'Ticket promedio', value: purchases ? money(revenue / purchases) : '-' },
        { label: 'Carritos abandonados', value: addCart ? (100 - pct(purchases, addCart)) + '%' : '-', event: 'add_to_cart sin purchase', alert: true },
        { label: 'Leads generados', value: fmt(n('generate_lead')), event: 'generate_lead' },
        { label: 'Busquedas sin resultado', value: fmt(n('search_no_results')), event: 'search_no_results', alert: true },
      ],
      funnel: [
        { label: 'view_item', event: 'view_item', count: viewItem, pct: 100 },
        { label: 'add_to_cart', event: 'add_to_cart', count: addCart, pct: pct(addCart, viewItem), drop: viewItem ? 100 - pct(addCart, viewItem) : 0 },
        { label: 'begin_checkout', event: 'begin_checkout', count: beginCk, pct: pct(beginCk, viewItem), drop: addCart ? 100 - pct(beginCk, addCart) : 0 },
        { label: 'add_shipping_info', event: 'add_shipping_info', count: ship, pct: pct(ship, viewItem), drop: beginCk ? 100 - pct(ship, beginCk) : 0 },
        { label: 'add_payment_info', event: 'add_payment_info', count: pay, pct: pct(pay, viewItem), drop: ship ? 100 - pct(pay, ship) : 0 },
        { label: 'purchase', event: 'purchase', count: purchases, pct: pct(purchases, viewItem), drop: pay ? 100 - pct(purchases, pay) : 0 },
      ],
      // En modo real NO se inventan datos: seccion sin dato -> vacia ("sin datos" en la UI)
      paymentMix: payMix.length ? toPct(payMix, 'blue') : [],
      topSearches: searches.length ? searches : [],
      noResults: noRes.length ? noRes.map(r => ({ ...r, tone: 'bad' as const })) : [],
      searchMix: searchMixRaw.some(s => s.value > 0) ? searchMixRaw.map(s => ({ label: s.label, pct: Math.round((s.value / smTotal) * 100), color: s.color })) : [],
      topViewed: [], topAdded: [], topPurchased: [], // item-scoped: pendiente de instrumentar flujo products
      leads: [
        { label: 'Cotizaciones', value: fmt(leadBy('quote')), event: 'generate_lead: quote' },
        { label: 'Form de contacto', value: fmt(leadBy('contact_form')), event: 'generate_lead: contact_form' },
        { label: 'WhatsApp producto', value: fmt(leadBy('whatsapp_product')), event: 'generate_lead: whatsapp_product' },
        { label: 'WhatsApp flotante', value: fmt(leadBy('whatsapp_floating')), event: 'generate_lead: whatsapp_floating' },
      ],
      chat: [
        { label: 'Aperturas', value: n('chat_open'), tone: 'violet' },
        { label: 'Mensajes enviados', value: n('chat_message_sent'), tone: 'violet' },
        { label: 'Derivo a busqueda', value: n('chat_product_search'), tone: 'violet' },
      ],
      account: [
        { label: 'Logins', a: fmt(n('login')) },
        { label: 'Registros', a: fmt(n('sign_up')), b: 'sign_up', tone: 'ok' },
        { label: 'Altas newsletter', a: fmt(n('newsletter_subscribe')), b: 'newsletter_subscribe' },
      ],
      devices: devices.length ? devices : [],
      revenueSeries: revSeries,
    };
  } catch (e) {
    return { ...mock }; // ante cualquier error de la Data API, no romper el panel
  }
}
