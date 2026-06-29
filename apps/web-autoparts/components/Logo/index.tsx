import { Logo as logoAutoparts } from './LogoAutoparts';
import { Logo as logoTools } from './LogoTools';
import { Logo as logoElectric } from './LogoElectric';
import { Logo as logoClima } from './LogoClima';
import { Logo as logoRobotec } from './LogoRobotec';

import { getEnvId } from 'shared';

const logos: Record<string, any> = {
  AUTOPARTS: logoAutoparts,
  CLIMA: logoClima,
  TOOLS: logoTools,
  ELECTRIC: logoElectric,
  ROBOTEC: logoRobotec,
};

export const Logo = () => {
  const id = getEnvId() || 'AUTOPARTS';
  const LogoComponent = logos[id] || logoAutoparts;
  return <LogoComponent />;
};
