import { useEffect, useRef } from 'react';
import { useCelesteStore } from 'shared';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const CursorFlag = () => {
  const enabled = useCelesteStore(s => s.enabled);
  const hydrated = useCelesteStore(s => s.hydrated);
  const ref = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const prevX = useRef(-100);
  const angle = useRef(0);
  const t = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !hydrated) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const K = 0.9;         // sensibilidad: px/frame -> grados
    const MAX_ANGLE = 30;  // tope de inclinacion por movimiento
    const IDLE_AMP = 3.5;  // amplitud del mecido idle (grados)
    const IDLE_SPEED = 0.05; // velocidad del seno -> ~2.5s por ciclo

    const loop = () => {
      t.current += 1; // contador de frames propio (no Date.now)

      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;

      // velocidad horizontal del cursor lerpeado -> angulo objetivo
      const vx = current.current.x - prevX.current;
      prevX.current = current.current.x;
      // balanceo por movimiento (clamp) + mecido sutil continuo (idle)
      const idleAngle = Math.sin(t.current * IDLE_SPEED) * IDLE_AMP;
      const targetAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, vx * K)) + idleAngle;
      // inercia tipo pendulo: se endereza solo cuando el mouse se frena
      angle.current += (targetAngle - angle.current) * 0.15;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x + 14}px, ${current.current.y + 4}px, 0)`;
      }
      if (imgRef.current) {
        imgRef.current.style.transform = `rotate(${angle.current}deg)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled, hydrated]);

  if (!enabled || !hydrated) return null;

  return (
    <div ref={ref} className="credi-cursor-flag">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`${BASE_PATH}/wordcup.png`}
        alt=""
        aria-hidden="true"
        className="credi-cursor-flag-img"
      />
    </div>
  );
};
