import { useEffect, useState } from 'react';
import { bff } from '../..';
import { Quote } from '../../entities/quote';
import { post } from '../../utils/fetcher';
import { Response } from './result';

export const useQuoteRequest = (req?: Quote): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (req) {
      const fetchData = async () => {
        if (req) {
          setIsLoading(true);
          const result = await post<boolean>(`${bff.url}/quotes/request`, { body: JSON.stringify(req) });
          if (!result) setError(new Error('Unexpected error.'));
          if (result) setData(result);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [req]);

  return { isLoading, data, error };
};
