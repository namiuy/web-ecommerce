import { ReactElement } from 'react';

type Props = { size?: number };

const buildRays = () => {
  const rays: ReactElement[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const x1 = 50 + Math.cos(angle) * 18;
    const y1 = 50 + Math.sin(angle) * 18;
    const x2 = 50 + Math.cos(angle) * 42;
    const y2 = 50 + Math.sin(angle) * 42;
    if (i % 2 === 0) {
      rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FCD116" strokeWidth="3" strokeLinecap="round" />);
    } else {
      const cx = 50 + Math.cos(angle) * 30;
      const cy = 50 + Math.sin(angle) * 30;
      const px = -Math.sin(angle) * 4;
      const py = Math.cos(angle) * 4;
      const dx = Math.cos(angle) * 6;
      const dy = Math.sin(angle) * 6;
      const d = `M ${x1} ${y1} Q ${cx + px} ${cy + py} ${cx + dx} ${cy + dy} Q ${cx - px} ${cy - py} ${x2} ${y2}`;
      rays.push(<path key={i} d={d} stroke="#FCD116" strokeWidth="2.4" fill="none" strokeLinecap="round" />);
    }
  }
  return rays;
};

export const SolMayo = ({ size = 64 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {buildRays()}
    <circle cx="50" cy="50" r="16" fill="#FCD116" stroke="#A87E00" strokeWidth="1" />
    <circle cx="44" cy="47" r="1.6" fill="#A87E00" />
    <circle cx="56" cy="47" r="1.6" fill="#A87E00" />
    <path d="M 43 54 Q 50 60 57 54" stroke="#A87E00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);
