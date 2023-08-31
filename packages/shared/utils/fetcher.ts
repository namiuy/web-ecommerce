type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getRequestInit = (method: Method, init?: RequestInit): RequestInit | undefined => {
  const withContent = method === 'POST' || method === 'PUT';
  return {
    method,
    headers: withContent
      ? {
          'Content-Type': 'application/json',
        }
      : {},
    ...init,
  };
};

export const fetcher = async (url: string, init?: RequestInit): Promise<any> => {
  const res = await fetch(url, init);
  return await res.json();
};

export const get = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init ? { ...init, method: 'GET' } : { method: 'GET' });
  return await res.json();
};

export const post = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, getRequestInit('POST', init));
  return await res.json();
};

export const put = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, getRequestInit('PUT', init));
  return await res.json();
};

export const del = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, getRequestInit('DELETE', init));
  return await res.json();
};
