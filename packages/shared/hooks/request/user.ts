import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { Response } from './response';
import { get, post } from '../../utils/fetcher';
import { User } from '../../entities/user';

const UNAUTHORIZED_MESSAGE = 'El correo electrónico y/o la contraseña son incorrectos.';
const UNEXPECTED_ERROR_MESSAGE = 'Ha ocurrido un error inesperado, por favor vuelve a intentarlo mas tarde.';

type SignInProps = {
  email: string;
  password: string;
};

type AccessToken = {
  access_token: string;
  user_id: string;
};

const getAccessToken = (username: string, password: string): Promise<AccessToken> =>
  post<AccessToken>(`${bff.url}/oauth/access_token`, { body: JSON.stringify({ username, password }) });

const getUser = (access_token: string, user_id: string): Promise<User> => {
  return get<User>(`${bff.url}/users/${user_id}`, { headers: { Authorization: `OAuth ${access_token}` } });
};

export const useSignIn = (props?: SignInProps): Response<User> => {
  const [accessTokenResult, setAccessTokenResult] = useState<AccessToken>();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        if (props) {
          setIsLoading(true);

          const result = await getAccessToken(props.email, props.password);
          if (typeof result === 'number') {
            setError(new Error(result === 401 ? UNAUTHORIZED_MESSAGE : UNEXPECTED_ERROR_MESSAGE));
            setIsLoading(false);
          } else {
            setAccessTokenResult(result);
          }
        }
      };

      fetchData();
    }
  }, [props]);

  useEffect(() => {
    if (accessTokenResult) {
      const fetchData = async () => {
        if (accessTokenResult) {
          const result = await getUser(accessTokenResult.access_token, accessTokenResult.user_id);
          if (typeof result === 'number') {
            setError(new Error(result === 401 ? UNAUTHORIZED_MESSAGE : UNEXPECTED_ERROR_MESSAGE));
          } else {
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
