import { useEffect, useState } from 'react';
import { Result } from './result';
import { get, post, put } from '../../utils/fetcher';
import { Person } from '../../entities/person';
import { PersonUpdate } from '../../entities/person-update';
import { useRequest } from '.';

export const useGetPerson = (id: string | null | undefined): Result<Person> => {
  // Don't make request if id is invalid
  const shouldFetch = id && id !== '0' && id !== 'null' && id !== 'undefined';
  const url = shouldFetch && id ? `/api/person?id=${id}` : null;
  return useRequest(url, true);
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
