import { SolMayo } from './assets/SolMayo';

type Props = { size?: number };

export const SunSpinner = ({ size = 64 }: Props) => (
  <div className="credi-sun-spin" style={{ width: size, height: size, display: 'inline-block' }}>
    <SolMayo size={size} />
  </div>
);
