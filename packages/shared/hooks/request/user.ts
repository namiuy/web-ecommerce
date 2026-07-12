import { useEffect, useState } from 'react';
import { Result } from './result';
import { get, post } from '../../utils/fetcher';
import { User } from '../../entities/user';
import { UserAdd } from '../../entities/user-add';
import lscache from 'lscache';
import { UserRestorePwd1 } from '../../entities/user-restore-pwd-1';
import { UserRestorePwd2 } from '../../entities/user-restore-pwd-2';
import { UserChangePwd } from '../../entities/user-change-pwd';
import { firebaseSignIn, firebaseSignUp } from '../../services/firebase';

type SignInProps = {
  email: string;
  password: string;
};

const getUser = (user_id: string): Promise<User> => {
  return get<User>(`/api/users/${user_id}`, {}, true);
};

const addUser = (user: UserAdd): Promise<Result<boolean>> => {
  return post<Result<boolean>>('/api/users', { body: JSON.stringify(user) });
};

const restorePwd1 = (user: UserRestorePwd1): Promise<Result<boolean>> => {
  return post<Result<boolean>>('/api/restore_password_1', { body: JSON.stringify(user) });
};

const restorePwd2 = (user: UserRestorePwd2): Promise<Result<boolean>> => {
  return post<Result<boolean>>('/api/restore_password_2', { body: JSON.stringify(user) });
};

const activateAccount = (activation_hash: string): Promise<Result<boolean>> => {
  return post<Result<boolean>>('/api/users/activate', { body: JSON.stringify({ activation_hash }) });
};

const changePwdUser = (user: UserChangePwd): Promise<Result<boolean>> => {
  return post<Result<boolean>>('/api/users/change-pwd', { body: JSON.stringify(user) }, true);
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
  const [firebaseUid, setFirebaseUid] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        if (props) {
          setIsLoading(true);
          try {
            // Step 1: Sign in with Firebase
            const { user: firebaseUser, token } = await firebaseSignIn(props.email, props.password);

            // Step 2: Store Firebase token in localStorage
            lscache.set('firebase_token', token);

            // Step 3: Store Firebase UID to fetch user from BFF
            setFirebaseUid(firebaseUser.uid);
          } catch (err: any) {
            console.error('Firebase sign in error:', err);
            setError(err.message || 'Error al iniciar sesión');
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }
  }, [props]);

  useEffect(() => {
    if (firebaseUid) {
      const fetchData = async () => {
        try {
          console.log('[useSignIn] Step 4: Fetching user for UID:', firebaseUid);
          const userData = await getUser(firebaseUid);
          console.log('[useSignIn] User data received:', userData);

          if (userData) {
            lscache.set('user', userData);
            setUser(userData);
          } else {
            setError('No se pudo obtener el usuario.');
          }
        } catch (err: any) {
          console.error('[useSignIn] Get user error:', err);
          setError(err.message || 'Error al obtener datos del usuario');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [firebaseUid]);

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
        try {
          // Step 1: Create user in Firebase
          const { user: firebaseUser, token } = await firebaseSignUp(props.email, props.password);

          // Step 2: Store Firebase token temporarily
          lscache.set('firebase_token', token);

          // Step 3: Create user profile in BFF/FastAPI with Firebase UID
          const userDataForBFF = {
            ...props,
            uid: firebaseUser.uid, // Send Firebase UID to BFF
          };

          const result = await addUser(userDataForBFF);

          if (result.error) {
            setError(result.error);
            setData(false);
          } else {
            setData(true);
          }
        } catch (err: any) {
          console.error('Firebase sign up error:', err);
          const code = err?.code || '';
          let message = err.message || 'Error al crear la cuenta';
          if (code === 'auth/email-already-in-use') message = 'Email already in use';
          else if (code === 'auth/weak-password') message = 'La contraseña es muy débil (mínimo 6 caracteres)';
          else if (code === 'auth/invalid-email') message = 'El email no es válido';
          setError(message);
          setData(false);
        } finally {
          setIsLoading(false);
        }
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
