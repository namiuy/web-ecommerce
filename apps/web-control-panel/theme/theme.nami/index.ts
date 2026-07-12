import { theme as themeClima } from './clima.theme';
import { theme as themeElectric } from './electric.theme';
import { theme as themeAutoparts } from './autoparts.theme';
import { theme as themeTools } from './tools.theme';
import { theme as themeRobotec } from './robotec.theme';

import { getEnvId } from 'shared';

const themes: Record<string, Record<string, any>> = {
  AUTOPARTS: themeAutoparts,
  CLIMA: themeClima,
  TOOLS: themeTools,
  NAMI: themeTools,
  ELECTRIC: themeElectric,
  ROBOTEC: themeRobotec,
};

export const theme = themes[getEnvId()] || themeTools;
