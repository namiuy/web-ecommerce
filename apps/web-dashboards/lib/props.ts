import { getDashboardData, getRealtime } from './analytics';
import { RangeKey } from './ga4';

const VALID: RangeKey[] = ['today', '7d', '28d', '90d'];

// Props del panel para un rango. JSON round-trip: Next no serializa `undefined` (deltaPct, opcionales).
export async function buildProps(raw?: string) {
  const range: RangeKey = VALID.includes(raw as RangeKey) ? (raw as RangeKey) : '28d';
  const [data, realtime] = await Promise.all([getDashboardData(range), getRealtime()]);
  return { props: JSON.parse(JSON.stringify({ data, realtime })) };
}
