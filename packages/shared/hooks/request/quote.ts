import { useEffect, useState } from 'react';
import { bff } from '../..';
import { Quote } from '../../entities/quote';
import { post } from '../../utils/fetcher';
import { Result } from './result';

const addQuote = (req: Quote): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/quotes/request`, { body: JSON.stringify(req) });
};

export const useQuoteRequest = (req?: Quote): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (req) {
      const fetchData = async () => {
        if (req) {
          setIsLoading(true);
          const result = await addQuote(req);

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
