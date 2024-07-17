import { theme as themeCredi } from './theme.credi';
import { theme as themeNami } from './theme.nami';

import { envId } from 'shared';

export const theme = envId === 'CREDI' ? themeCredi : themeNami;
