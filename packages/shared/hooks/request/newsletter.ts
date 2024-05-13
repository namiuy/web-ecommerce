import { bff } from '../../env';
import { post } from '../../utils/fetcher';
import { Suscription } from '../../entities/suscription';

export const newsletterSubscribe = (data: Suscription): Promise<boolean> =>
  post<boolean>(`${bff.url}/newsletter/subscribe`, { body: JSON.stringify(data) });
