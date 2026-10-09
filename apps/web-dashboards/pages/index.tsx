import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Dashboard, Realtime, BarRow, Kpi, TableRow } from '../lib/analytics';
import { RangeKey } from '../lib/ga4';
import { buildProps } from '../lib/props';

import TopBar from '../components/TopBar';

const RevenueChart = dynamic(() => import('../components/Charts').then(m => m.RevenueChart), { ssr: false });
const ActivityChart = dynamic(() => import('../components/Charts').then(m => m.ActivityChart), { ssr: false });
const FunnelChart = dynamic(() => import('../components/Charts').then(m => m.FunnelChart), { ssr: false });
const MixDoughnut = dynamic(() => import('../components/Charts').then(m => m.MixDoughnut), { ssr: false });
const LiveStrip = dynamic(() => import('../components/LiveStrip'), { ssr: false });

const Empty = ({ hint }: { hint?: string }) => <p className="muted empty">{hint || 'Sin datos aun'}</p>;

const Delta = ({ pct, invert }: { pct?: number; invert?: boolean }) => {
  if (pct === undefined || !isFinite(pct)) return null;
  const up = pct >= 0;
  const good = invert ? !up : up;
  return <span className={`delta ${good ? 'up' : 'down'}`}>{up ? '▲' : '▼'} {Math.abs(pct)}%</span>;
};

const Bars = ({ rows, hint }: { rows: BarRow[]; hint?: string }) => {
  if (!rows.length) return <Empty hint={hint} />;
  const max = Math.max(...rows.map(r => r.value), 1);
  return (
    <div className="bars">
      {rows.map((r, i) => (
        <div className="bar" key={i}>
          <span className="lbl">{r.label}</span>
          <div className="track"><div className={`fill ${r.tone || 'blue'}`} style={{ width: `${Math.round((r.value / max) * 100)}%` }} /></div>
          <span className="n">{r.value.toLocaleString('es-UY')}</span>
        </div>
      ))}
    </div>
  );
};

const KpiCard = ({ k }: { k: Kpi }) => (
  <div className={`panel kpi ${k.alert ? 'alert' : ''}`}>
    <h3>{k.label}</h3>
    <div className="val">{k.value}</div>
    <div className="kline"><Delta pct={k.deltaPct} invert={k.invert} />{k.event && <span className="evt">{k.event}</span>}</div>
  </div>
);

const Table = ({ rows, head, hint }: { rows: TableRow[]; head: string[]; hint?: string }) => (
  !rows.length ? <Empty hint={hint} /> :
    <table>
      <thead><tr>{head.map((h, i) => <th key={i} className={i ? 'r' : ''}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => (
        <tr key={i}><td>{r.label}</td><td className="r">{r.a}</td>{r.b !== undefined && <td className="r">{r.tone ? <span className={`pill ${r.tone}`}>{r.b}</span> : r.b}</td>}</tr>
      ))}</tbody>
    </table>
);

const RANGE_OPTS: { k: RangeKey; t: string }[] = [{ k: 'today', t: 'Hoy' }, { k: '7d', t: '7 dias' }, { k: '28d', t: '28 dias' }, { k: '90d', t: '90 dias' }];

export const DashboardView: NextPage<{ data: Dashboard; realtime: Realtime }> = ({ data, realtime }) => (
  <div className="wrap">
    <TopBar source={data.source} property={data.property} />

    <div className="toolbar">
      <div className="ranges">
        {RANGE_OPTS.map(o => <a key={o.k} href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${o.k}`} className={`chip ${data.rangeKey === o.k ? 'active' : ''}`}>{o.t}</a>)}
      </div>
      <span className="muted cmp">vs periodo anterior &middot; excluye trafico interno</span>
    </div>

    <LiveStrip initial={realtime} />

    <div className="grid g4 sec">{data.kpis.map((k, i) => <KpiCard k={k} key={i} />)}</div>

    <div className="grid g2 sec">
      <div className="panel">
        <h3>Ingresos</h3><div className="evt">purchase.value &middot; {data.range}</div>
        <div className="chart h230">{data.revenue.values.some(v => v) ? <RevenueChart labels={data.revenue.labels} values={data.revenue.values} /> : <Empty hint="Sin compras en el periodo" />}</div>
      </div>
      <div className="panel">
        <h3>Actividad</h3><div className="evt">sessions &middot; {data.range}</div>
        <div className="chart h230">{data.activity.values.some(v => v) ? <ActivityChart labels={data.activity.labels} values={data.activity.values} /> : <Empty />}</div>
      </div>
    </div>

    <div className="grid sec">
      <div className="panel">
        <h3>Funnel de venta</h3><div className="evt">view_item &rarr; purchase</div>
        <div className="chart h220">{data.funnel.some(s => s.count) ? <FunnelChart steps={data.funnel} /> : <Empty hint="Faltan eventos de compra (flujo products)" />}</div>
        <div className="funnel-foot">{data.funnel.map((s, i) => <span key={i}><b>{s.pct}%</b> {s.label}</span>)}</div>
      </div>
    </div>

    <h2 className="sec-t">Trafico y pagos</h2>
    <div className="grid g3">
      <div className="panel"><h3>Canales</h3><div className="evt">sessionDefaultChannelGroup</div><div className="chart h200">{data.channels.length ? <MixDoughnut rows={data.channels} /> : <Empty />}</div></div>
      <div className="panel"><h3>Dispositivos</h3><div className="evt">deviceCategory</div><div className="chart h200">{data.devices.length ? <MixDoughnut rows={data.devices} /> : <Empty />}</div></div>
      <div className="panel"><h3>Metodo de pago</h3><div className="evt">add_payment_info.payment_type</div><div className="chart h200">{data.paymentMix.length ? <MixDoughnut rows={data.paymentMix} /> : <Empty hint="Requiere custom dimension payment_type" />}</div></div>
    </div>

    <h2 className="sec-t">Busquedas - que buscan y que no encuentran</h2>
    <div className="grid g3">
      <div className="panel"><h3>Palabras mas buscadas</h3><div className="evt">search.search_term</div><Bars rows={data.topSearches} hint="Requiere custom dimension search_term" /></div>
      <div className="panel alert"><h3>Busquedas SIN resultado</h3><div className="evt">search_no_results.search_term</div><Bars rows={data.noResults} hint="Requiere custom dimension search_term" /></div>
      <div className="panel"><h3>Tipo de busqueda</h3><div className="evt">search / by_vehicle / by_code / by_dimensions</div><div className="chart h200">{data.searchMix.length ? <MixDoughnut rows={data.searchMix.map(s => ({ label: s.label, value: s.pct }))} /> : <Empty />}</div></div>
    </div>

    <h2 className="sec-t">Productos</h2>
    <div className="grid g3">
      <div className="panel"><h3>Mas vistos</h3><div className="evt">view_item</div><Table rows={data.topViewed} head={['Producto', 'Vistas']} hint="Pendiente: flujo products" /></div>
      <div className="panel"><h3>Mas agregados</h3><div className="evt">add_to_cart</div><Table rows={data.topAdded} head={['Producto', 'Add', 'Ratio']} hint="Pendiente: flujo products" /></div>
      <div className="panel"><h3>Mas comprados</h3><div className="evt">purchase.items</div><Table rows={data.topPurchased} head={['Producto', 'Unid.', '$']} hint="Pendiente: flujo products" /></div>
    </div>

    <h2 className="sec-t">Leads</h2>
    <div className="grid g4">{data.leads.map((k, i) => <KpiCard k={k} key={i} />)}</div>

    <h2 className="sec-t">Chat IA y cuenta</h2>
    <div className="grid g3">
      <div className="panel"><h3>Uso del chat IA</h3><div className="evt">chat_open / message / product_search</div><Bars rows={data.chat} /></div>
      <div className="panel"><h3>Cuenta</h3><div className="evt">login / sign_up / newsletter</div><Table rows={data.account} head={['', '', '']} /></div>
      <div className="panel"><h3>Dispositivo (sesiones)</h3><div className="evt">deviceCategory</div><Bars rows={data.devices} /></div>
    </div>

    <footer>{data.source === 'ga4' ? 'Datos en vivo - GA4 Data API.' : 'Datos de ejemplo.'} &middot; Robotec &middot; {data.property}</footer>
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => buildProps('28d');

export default DashboardView;
