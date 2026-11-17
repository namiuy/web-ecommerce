import { useCallback, useEffect, useState } from 'react';
import { Result } from './result';
import { get, put } from '../../utils/fetcher';
import { Person } from '../../entities/person';
import { PersonUpdate } from '../../entities/person-update';

export const useGetPerson = (id: string | null | undefined): Result<Person> & { refetch: () => void } => {
  const [data, setData] = useState<Person | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fetchCount, setFetchCount] = useState(0);

  const shouldFetch = id && id !== '0' && id !== 'null' && id !== 'undefined';

  useEffect(() => {
    if (!shouldFetch || !id) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await get<Person>(`/api/person?id=${id}`, {}, true);
        if ((result as any)?.error) {
          setError((result as any).error);
        } else {
          setData(result);
          setError(undefined);
        }
      } catch (err: any) {
        setError(err.message || 'Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, shouldFetch, fetchCount]);

  const refetch = useCallback(() => setFetchCount((c) => c + 1), []);

  return { data, isLoading, error, refetch };
};

const updatePerson = (person: PersonUpdate): Promise<Result<boolean>> => {
  return put<Result<boolean>>('/api/person', { body: JSON.stringify(person) }, true);
};

export const useUpdatePerson = (props?: PersonUpdate): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await updatePerson(props);

        if (result.error) {
          setError(result.error);
          setData(undefined);
        } else {
          setData(true);
          setError(undefined);
        }
        setIsLoading(false);
      };
      fetchData();
    }

    return () => {
      setData(undefined);
      setError(undefined);
    };
  }, [props]);

  return { isLoading, data, error };
};
