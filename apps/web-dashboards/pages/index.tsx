import type { GetServerSideProps, NextPage } from 'next';
import { getDashboardData, Dashboard, BarRow, Kpi, TableRow } from '../lib/analytics';

const maxOf = (rows: BarRow[]) => Math.max(...rows.map(r => r.value), 1);

const Empty = () => <p className="muted" style={{ fontSize: 12, margin: '14px 0' }}>Sin datos aun</p>;

const Sparkline = ({ series }: { series: number[] }) => {
  if (!series.length || series.every(v => !v)) return <Empty />;
  const w = 520, h = 170, max = Math.max(...series, 1);
  const step = series.length > 1 ? w / (series.length - 1) : w;
  const pts = series.map((v, i) => `${Math.round(i * step)},${Math.round(h - (v / max) * (h - 20) - 10)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={170} preserveAspectRatio="none">
      <polyline fill="rgba(56,193,114,.15)" stroke="none" points={`0,${h} ${pts} ${w},${h}`} />
      <polyline fill="none" stroke="var(--ok)" strokeWidth="2.5" points={pts} />
    </svg>
  );
};

const Bars = ({ rows }: { rows: BarRow[] }) => {
  if (!rows.length) return <Empty />;
  const max = maxOf(rows);
  return (
    <div className="bars">
      {rows.map((r, i) => (
        <div className="bar" key={i}>
          <span className="lbl">{r.label}</span>
          <div className="track"><div className={`fill ${r.tone === 'violet' ? 'violet' : r.tone === 'bad' ? 'bad' : ''}`} style={{ width: `${Math.round((r.value / max) * 100)}%` }} /></div>
          <span className="n">{r.value}</span>
        </div>
      ))}
    </div>
  );
};

const KpiCard = ({ k }: { k: Kpi }) => (
  <div className="panel kpi" style={k.alert ? { borderColor: '#4a2a28' } : undefined}>
    <h3>{k.label}</h3>
    <div className="val">{k.value}</div>
    {k.delta && <div className={`delta ${k.trend === 'down' ? 'down' : 'up'}`}>{k.trend === 'down' ? '▼' : '▲'} {k.delta}</div>}
    {k.event && <div className="evt">{k.event}</div>}
  </div>
);

const Table = ({ rows, head }: { rows: TableRow[]; head: string[] }) => (
  !rows.length ? <Empty /> :
  <table>
    <thead><tr>{head.map((h, i) => <th key={i} className={i ? 'r' : ''}>{h}</th>)}</tr></thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>
          <td>{r.label}</td>
          <td className="r">{r.a}</td>
          {r.b !== undefined && <td className="r">{r.tone ? <span className={`pill ${r.tone}`}>{r.b}</span> : r.b}</td>}
        </tr>
      ))}
    </tbody>
  </table>
);

const Donut = ({ slices }: { slices: Dashboard['searchMix'] }) => {
  if (!slices.length) return <Empty />;
  let acc = 0;
  return (
    <div className="donut-wrap">
      <svg width="120" height="120" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--panel2)" strokeWidth="6" />
        {slices.map((s, i) => {
          const el = <circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={s.color} strokeWidth="6" strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeDashoffset={25 - acc} />;
          acc += s.pct;
          return el;
        })}
      </svg>
      <div className="legend">
        {slices.map((s, i) => <div key={i}><i style={{ background: s.color }} />{s.label} &nbsp;{s.pct}%</div>)}
      </div>
    </div>
  );
};

const Home: NextPage<{ data: Dashboard }> = ({ data }) => (
  <div className="wrap">
    <header className="top">
      <div className="brand"><span className="dot" /> ROBOTEC AUTOPARTES <small>&nbsp;&middot;&nbsp; Panel GA4</small></div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {data.source === 'mock' && <span className="flag">DATOS DE EJEMPLO - Data API pendiente</span>}
        <span className="muted" style={{ fontSize: 12 }}>{data.property}</span>
      </div>
    </header>

    <div className="filters">
      <span className="chip active">{data.range}</span>
      <span className="chip">Hoy</span><span className="chip">7 dias</span><span className="chip">90 dias</span>
      <span className="chip">Comparar periodo anterior</span>
      <span className="chip" style={{ marginLeft: 'auto' }}>Excluye trafico interno (vendedor/admin)</span>
    </div>

    <h2 className="sec">Resumen</h2>
    <div className="grid g4">{data.kpis.map((k, i) => <KpiCard k={k} key={i} />)}</div>

    <h2 className="sec">Funnel de venta</h2>
    <div className="grid g2">
      <div className="panel">
        <h3>Embudo de compra</h3>
        <div className="evt">view_item &rarr; add_to_cart &rarr; begin_checkout &rarr; add_shipping_info &rarr; add_payment_info &rarr; purchase</div>
        <div className="funnel">
          {data.funnel.map((s, i) => (
            <div className="step" key={i}>
              <div className="meta">{s.event}<br /><b>{s.count.toLocaleString('es-UY')}</b> {s.drop ? <span className="drop">-{s.drop}%</span> : null}</div>
              <div className="fbar" style={{ width: `${Math.max(s.pct, 12)}%` }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>Ingresos por dia</h3><div className="evt">purchase.value</div>
        <div className="spark"><Sparkline series={data.revenueSeries} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="muted"><span>hace 28d</span><span>hoy</span></div>
        <h3 style={{ marginTop: 18 }}>Compras por metodo de pago</h3><div className="evt">add_payment_info.payment_type</div>
        <Bars rows={data.paymentMix} />
      </div>
    </div>

    <h2 className="sec">Busquedas - que buscan y que no encuentran</h2>
    <div className="grid g3">
      <div className="panel"><h3>Palabras mas buscadas</h3><div className="evt">search.search_term</div><Bars rows={data.topSearches} /></div>
      <div className="panel" style={{ borderColor: '#4a2a28' }}>
        <h3>Busquedas SIN resultado</h3><div className="evt">search_no_results.search_term</div>
        <p className="muted" style={{ fontSize: 11, margin: '6px 0' }}>Demanda insatisfecha / gaps de catalogo o de nombres. Lo mas accionable del panel.</p>
        <Bars rows={data.noResults} />
      </div>
      <div className="panel"><h3>Tipo de busqueda</h3><div className="evt">search / search_by_vehicle / search_by_code / search_by_dimensions</div><Donut slices={data.searchMix} /></div>
    </div>

    <h2 className="sec">Productos</h2>
    <div className="grid g3">
      <div className="panel"><h3>Mas vistos</h3><div className="evt">view_item</div><Table rows={data.topViewed} head={['Producto', 'Vistas']} /></div>
      <div className="panel"><h3>Mas agregados al carrito</h3><div className="evt">add_to_cart</div><Table rows={data.topAdded} head={['Producto', 'Add', 'Ratio']} /></div>
      <div className="panel"><h3>Mas comprados</h3><div className="evt">purchase.items</div><Table rows={data.topPurchased} head={['Producto', 'Unid.', '$']} /></div>
    </div>

    <h2 className="sec">Leads y contacto (canales fuera de la compra directa)</h2>
    <div className="grid g4">{data.leads.map((k, i) => <KpiCard k={k} key={i} />)}</div>

    <h2 className="sec">Chat IA (Nami IA) y cuenta</h2>
    <div className="grid g3">
      <div className="panel">
        <h3>Uso del chat IA</h3><div className="evt">chat_open / chat_message_sent / chat_product_search</div>
        <Bars rows={data.chat} />
        <p className="muted" style={{ fontSize: 11, marginTop: 10 }}>Mide si el chat ayuda a encontrar producto o solo consume.</p>
      </div>
      <div className="panel"><h3>Cuenta</h3><div className="evt">login / sign_up / newsletter_subscribe</div><Table rows={data.account} head={['', '', '']} /></div>
      <div className="panel"><h3>Dispositivo</h3><div className="evt">GA4 estandar (device)</div><Bars rows={data.devices} /></div>
    </div>

    <footer>
      {data.source === 'mock' ? 'Datos de ejemplo - al conectar la GA4 Data API se reemplazan por reales.' : 'Datos en vivo - GA4 Data API.'}<br />
      Mapea 1:1 con los eventos instrumentados en web-autoparts. Robotec Autopartes &middot; {data.property}
    </footer>
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getDashboardData();
  return { props: { data } };
};

export default Home;
