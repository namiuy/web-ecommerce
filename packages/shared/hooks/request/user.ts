import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { Result } from './result';
import { get, post } from '../../utils/fetcher';
import { User } from '../../entities/user';
import { UserAdd } from '../../entities/user-add';
import lscache from 'lscache';
import { UserRestorePwd1 } from '../../entities/user-restore-pwd-1';
import { UserRestorePwd2 } from '../../entities/user-restore-pwd-2';
import { UserChangePwd } from '../../entities/user-change-pwd';

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
  return get<User>(`${bff.url}/users/${user_id}`, {}, true);
};

const addUser = (user: UserAdd): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/users`, { body: JSON.stringify(user) });
};

const restorePwd1 = (user: UserRestorePwd1): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/restore_password_1`, { body: JSON.stringify(user) });
};

const restorePwd2 = (user: UserRestorePwd2): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/restore_password_2`, { body: JSON.stringify(user) });
};

const activateAccount = (activation_hash: string): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/users/activate`, { body: JSON.stringify({ activation_hash }) });
};

const changePwdUser = (user: UserChangePwd): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/users/change-pwd`, { body: JSON.stringify(user) }, true);
};

export const useGetUser = (id: string): Result<User> => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getUser(id);

      if (result.error) {
        setError(result.error);
      } else {
        setUser(result);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  return { isLoading, data: user, error };
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

export const useRestorePwd1 = (props?: UserRestorePwd1): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await restorePwd1(props);
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

export const useRestorePwd2 = (props?: UserRestorePwd2): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await restorePwd2(props);

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

export const useActivateAccount = (guid: string): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (guid) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await activateAccount(guid);

        if (result.error) {
          setError(result.error);
        } else {
          setData(true);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [guid]);

  return { isLoading, data, error };
};

export const useChangePwdUser = (props?: UserChangePwd): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await changePwdUser(props);

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
