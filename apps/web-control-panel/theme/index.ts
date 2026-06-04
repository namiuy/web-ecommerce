import { theme as themeCredi } from './theme.credi';
import { theme as themeNami } from './theme.nami';

import { getEnvId } from 'shared';

export const theme = getEnvId() === 'CREDI' ? themeCredi : themeNami;
