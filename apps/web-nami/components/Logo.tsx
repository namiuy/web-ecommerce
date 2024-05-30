import { Logo as logoAutoparts } from './LogoAutoparts';
import { Logo as logoTools } from './LogoTools';
import { Logo as logoElectric } from './LogoElectric';
import { Logo as logoClima } from './LogoClima';
import { Logo as logoRobotec } from './LogoRobotec';

import { envId } from 'shared';

const logos: Record<string, any> = {
  AUTOPARTS: logoAutoparts,
  CLIMA: logoClima,
  TOOLS: logoTools,
  ELECTRIC: logoElectric,
  ROBOTEC: logoRobotec,
};

export const Logo = logos[envId];
