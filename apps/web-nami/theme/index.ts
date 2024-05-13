import { theme as themeClima } from './clima.theme';
import { theme as themeElectric } from './electric.theme';
import { theme as themeNami } from './nami.theme';
import { theme as themeTools } from './tools.theme';

import { envId } from 'shared';

const themes: Record<string, Record<string, any>> = {
  AUTOPARTS: themeNami,
  CLIMA: themeClima,
  TOOLS: themeTools,
  ELECTRIC: themeElectric,
};

export const theme = themes[envId];
