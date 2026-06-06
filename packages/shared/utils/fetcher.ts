import lscache from 'lscache';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const refreshToken = async (): Promise<string | null> => {
  try {
    const { getCurrentUserToken } = await import('../services/firebase');
    const token = await getCurrentUserToken();
    if (token) {
      lscache.set('firebase_token', token);
    }
    return token;
  } catch {
    return lscache.get('firebase_token');
  }
};

const getRequestInit = async (
  method: Method,
  init: RequestInit = {} as RequestInit,
  withAuth: boolean = false,
): Promise<RequestInit> => {
  const withContent = method === 'POST' || method === 'PUT' || method === 'DELETE';

  // Get fresh Firebase ID token
  const firebaseToken = withAuth ? await refreshToken() : null;

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

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return await res.json();
};

export const get = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, await getRequestInit('GET', init, withAuth));
  return handleResponse<T>(res);
};

export const post = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, await getRequestInit('POST', init, withAuth));
  return handleResponse<T>(res);
};

export const put = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, await getRequestInit('PUT', init, withAuth));
  return handleResponse<T>(res);
};

export const del = async <T>(url: string, init?: RequestInit, withAuth?: boolean): Promise<T> => {
  const res = await fetch(url, await getRequestInit('DELETE', init, withAuth));
  return handleResponse<T>(res);
};

export const postFormData = async <T>(url: string, formData: FormData, withAuth?: boolean): Promise<T> => {
  // Get fresh Firebase ID token
  const firebaseToken = withAuth ? await refreshToken() : null;

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
