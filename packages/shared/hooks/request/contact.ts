import { useEffect, useState } from 'react';
import { bff } from '../..';
import { Contact } from '../../entities/contact';
import { post } from '../../utils/fetcher';
import { Result } from './result';

const sendEmail = (req: Contact): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/contact/email`, { body: JSON.stringify(req) });
};

export const useContactRequest = (req?: Contact): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (req) {
      const fetchData = async () => {
        if (req) {
          setIsLoading(true);
          const result = await sendEmail(req);

          if (result.error) {
            setError(result.error);
          } else {
            setData(true);
          }
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [req]);

  return { isLoading, data, error };
};
