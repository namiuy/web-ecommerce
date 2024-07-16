import { theme as themeCredi } from '../../web-credibikerss/theme';
import { theme as themeNami } from '../../web-nami/theme';

import { envId } from 'shared';

export const theme = envId === 'CREDI' ? themeCredi : themeNami;
