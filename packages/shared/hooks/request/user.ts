import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { Result } from './result';
import { get, post } from '../../utils/fetcher';
import { User } from '../../entities/user';
import { UserAdd } from '../../entities/user-add';
import lscache from 'lscache';

type SignInProps = {
  email: string;
  password: string;
};

type AccessToken = {
  access_token: string;
  user_id: string;
  error?: string;
};

const getAccessToken = (username: string, password: string): Promise<AccessToken> =>
  post<AccessToken>(`${bff.url}/oauth/access_token`, { body: JSON.stringify({ username, password }) });

const getUser = (user_id: string): Promise<User> => {
  return get<User>(`${bff.url}/users/${user_id}`);
};

const addUser = (user: UserAdd): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/users`, { body: JSON.stringify(user) });
};

export const useSignIn = (props?: SignInProps): Result<User> => {
  const [accessTokenResult, setAccessTokenResult] = useState<AccessToken>();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        if (props) {
          setIsLoading(true);
          const result = await getAccessToken(props.email, props.password);

          if (result.error) {
            setError(result.error);
          } else {
            lscache.set('access_token', result);
            setAccessTokenResult(result);
            lscache.set('access_token', result);
          }
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [props]);

  useEffect(() => {
    if (accessTokenResult) {
      const fetchData = async () => {
        if (accessTokenResult) {
          const result = await getUser(accessTokenResult.user_id);

          if (result.error) {
            setError(result.error);
          } else {
            lscache.set('user', result);
            setUser(result);
          }
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [accessTokenResult]);

  return { isLoading, data: user, error };
};

export const useAddUser = (props?: UserAdd): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await addUser(props);

        if (result.error) {
          setError(result.error);
        } else {
          setData(true);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [props]);

  return { isLoading, data, error };
};
