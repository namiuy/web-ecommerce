import lscache from 'lscache';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getRequestInit = (
  method: Method,
  init: RequestInit = {} as RequestInit,
  withAuth: boolean = false,
): RequestInit | undefined => {
  const withContent = method === 'POST' || method === 'PUT' || method === 'DELETE';
  return {
    method,
    headers: {
      ...(withContent ? { 'Content-Type': 'application/json' } : {}),
      ...(withAuth && lscache.get('access_token')
        ? { Authorization: `OAuth ${lscache.get('access_token')?.access_token}` }
        : {}),
    },
    ...init,
  };
};

export const get = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, getRequestInit('GET', init, withAuth));
  return await res.json();
};

export const post = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, getRequestInit('POST', init, withAuth));
  return await res.json();
};

export const put = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, getRequestInit('PUT', init, withAuth));
  return await res.json();
};

export const del = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, getRequestInit('DELETE', init, withAuth));
  return await res.json();
};
