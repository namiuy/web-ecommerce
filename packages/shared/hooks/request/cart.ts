import { Cart } from '../../entities/cart';
import { CartItem } from '../../entities/cart-item';
import lscache from 'lscache';

function getAnonymousId(): string {
  let id = lscache.get('anonymous_cart_id');
  if (!id) {
    id = crypto.randomUUID();
    lscache.set('anonymous_cart_id', id);
  }
  return id;
}

function isLoggedIn(): boolean {
  return !!lscache.get('user');
}

async function cartFetch<T>(url: string, method: string, body?: any): Promise<T> {
  const loggedIn = isLoggedIn();
  const headers: Record<string, string> = {};

  if (!loggedIn) {
    headers['X-Anonymous-Id'] = getAnonymousId();
  }

  // Get auth token if logged in
  if (loggedIn) {
    try {
      const { getCurrentUserToken } = await import('../../services/firebase');
      const token = await getCurrentUserToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Firebase not available
    }
  }

  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const addToCart = (item: Partial<CartItem>): Promise<Cart> => {
  return cartFetch<Cart>('/api/cart', 'POST', item);
};

export const updateQuantityCart = (item: Partial<CartItem>): Promise<Cart> => {
  return cartFetch<Cart>('/api/cart', 'PUT', item);
};

export const deleteFromCart = (item: Partial<CartItem>): Promise<Cart> => {
  return cartFetch<Cart>('/api/cart', 'DELETE', item);
};

export const getCart = (): Promise<Cart> => {
  return cartFetch<Cart>('/api/cart', 'GET');
};

export const mergeAnonymousCart = async (): Promise<Cart | null> => {
  const anonId = lscache.get('anonymous_cart_id');
  if (!anonId) return null;

  try {
    const { getCurrentUserToken } = await import('../../services/firebase');
    const token = await getCurrentUserToken();
    if (!token) return null;

    const res = await fetch('/api/cart/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ anonymous_id: anonId }),
    });

    if (res.ok) {
      lscache.remove('anonymous_cart_id');
      return res.json();
    }
  } catch {
    // Merge failed silently
  }
  return null;
};
