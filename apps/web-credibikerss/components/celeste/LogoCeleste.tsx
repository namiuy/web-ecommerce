import { useCelesteStore } from 'shared';
import { Logo } from '../Logo';

const FourStars = () => (
  <span
    className="credi-logo-stars"
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: -14,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '2px',
      whiteSpace: 'nowrap',
      animation: 'credi-estrella-in 0.45s ease-out both',
    }}
  >
    {['★', '★', '★', '★'].map((s, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="#FCD116"
        stroke="#A87E00"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
  </span>
);

export const LogoCeleste = (props: any) => {
  const enabled = useCelesteStore(s => s.enabled);
  const hydrated = useCelesteStore(s => s.hydrated);
  const showStars = enabled && hydrated;

  return (
    <span style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
      <Logo {...props} />
      {showStars && <FourStars />}
    </span>
  );
};
