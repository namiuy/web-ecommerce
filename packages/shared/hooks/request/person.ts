import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { Result } from './result';
import { get, post, put } from '../../utils/fetcher';
import { Person } from '../../entities/person';
import { PersonUpdate } from '../../entities/person-update';
import { useRequest } from '.';

export const useGetPerson = (id: string): Result<Person> => useRequest(`${bff.url}/person/${id}`, true);

const updatePerson = (person: PersonUpdate): Promise<Result<boolean>> => {
  return put<Result<boolean>>(`${bff.url}/person`, { body: JSON.stringify(person) }, true);
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
