import lscache from 'lscache';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const getRequestInit = (
  method: Method,
  init: RequestInit = {} as RequestInit,
  withAuth: boolean = false,
): RequestInit | undefined => {
  const withContent = method === 'POST' || method === 'PUT' || method === 'DELETE';

  // Get Firebase ID token from localStorage
  const firebaseToken = lscache.get('firebase_token');

  return {
    method,
    headers: {
      ...(withContent ? { 'Content-Type': 'application/json' } : {}),
      ...(withAuth && firebaseToken
        ? { Authorization: `Bearer ${firebaseToken}` }
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
  // Get Firebase ID token from localStorage
  const firebaseToken = lscache.get('firebase_token');

  const headers: HeadersInit = {
    ...(withAuth && firebaseToken
      ? { Authorization: `Bearer ${firebaseToken}` }
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
