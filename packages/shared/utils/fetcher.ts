type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getRequestInit = (method: Method, init?: RequestInit): RequestInit | undefined => {
  const withContent = method === 'POST' || method === 'PUT';
  return {
    ...init,
    method,
    headers: withContent
      ? {
          'Content-Type': 'application/json',
        }
      : {},
  };
};

export const fetcher = async (url: string, init?: RequestInit): Promise<any> => {
  const res = await fetch(url, init);
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};

export const get = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init ? { ...init, method: 'GET' } : { method: 'GET' });
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};

export const post = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, getRequestInit('POST', init));
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};

export const put = async <T>(url: string, init?: RequestInit): Promise<T> => {
  console.log(getRequestInit('PUT', init));
  const res = await fetch(url, getRequestInit('PUT', init));
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};

export const del = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, getRequestInit('DELETE', init));
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};
