import { useEffect, useState } from 'react';

type RT = { activeUsers: number; byDevice: { label: string; value: number }[]; topEvents: { label: string; value: number }[] } | null;

export default function LiveStrip({ initial }: { initial: RT }) {
  const [rt, setRt] = useState<RT>(initial);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const load = () => fetch(`${base}/api/realtime`).then(r => r.json()).then(setRt).catch(() => {});
    const id = setInterval(() => { load(); setTick(t => t + 1); }, 20000); // refresca cada 20s
    return () => clearInterval(id);
  }, []);

  const users = rt?.activeUsers ?? 0;
  return (
    <div className="live">
      <div className="live-now">
        <span className="pulse" />
        <div>
          <div className="live-num">{users}</div>
          <div className="live-lbl">usuarios activos ahora</div>
        </div>
      </div>
      <div className="live-split">
        <span className="live-cap">En vivo (30 min)</span>
        <div className="live-chips">
          {(rt?.topEvents || []).slice(0, 5).map((e, i) => (
            <span className="live-chip" key={i}>{e.label} <b>{e.value}</b></span>
          ))}
          {!rt?.topEvents?.length && <span className="muted" style={{ fontSize: 12 }}>sin actividad</span>}
        </div>
      </div>
      <div className="live-refresh" key={tick}>auto 20s</div>
    </div>
  );
}
