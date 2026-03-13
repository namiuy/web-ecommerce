import { theme as themeClima } from './clima.theme';
import { theme as themeElectric } from './electric.theme';
import { theme as themeNami } from './nami.theme';
import { theme as themeTools } from './tools.theme';
import { theme as themeRobotec } from './robotec.theme';

import { getEnvId } from 'shared';

const themes: Record<string, Record<string, any>> = {
  AUTOPARTS: themeNami,
  CLIMA: themeClima,
  TOOLS: themeTools,
  ELECTRIC: themeElectric,
  ROBOTEC: themeRobotec,
};

// Use getter function to avoid build-time execution
export const theme = themes[getEnvId()] || themeTools;
