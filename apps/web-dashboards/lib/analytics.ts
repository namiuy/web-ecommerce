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
};

export async function getDashboardData(): Promise<Dashboard> {
  // TODO(GA4 Data API): si hay credenciales, consultar runReport y mapear a Dashboard.
  return mock;
}
