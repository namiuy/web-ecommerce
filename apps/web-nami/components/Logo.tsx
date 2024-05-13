import { Logo as logoAutoparts } from './LogoAutoparts';
import { Logo as logoTools } from './LogoTools';
import { Logo as logoElectric } from './LogoElectric';
import { Logo as logoClima } from './LogoClima'; //add clima logo

import { envId } from 'shared';

const logos: Record<string, any> = {
  AUTOPARTS: logoAutoparts,
  CLIMA: logoClima,
  TOOLS: logoTools,
  ELECTRIC: logoElectric,
};

export const Logo = logos[envId];
