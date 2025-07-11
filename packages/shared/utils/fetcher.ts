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

export const postFormData = async <T>(url: string, formData: FormData, withAuth?: boolean): Promise<T> => {
  const headers: HeadersInit = {
    ...(withAuth && lscache.get('access_token')
      ? { Authorization: `OAuth ${lscache.get('access_token')?.access_token}` }
      : {}),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  const contentType = res.headers.get('content-type');

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    const text = await res.text();
    throw new Error(`Respuesta inesperada del servidor: ${text}`);
  }
};
