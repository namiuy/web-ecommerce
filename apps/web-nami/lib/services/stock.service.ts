import { apiFetch } from '../api-client';
import type { Stock } from 'shared/entities/stock';
import { config } from '../config';

// --- Helper to get raw API URL (without /api suffix) ---

const getApiBaseUrlRaw = () => {
  if (!config.apiBaseUrl || config.apiBaseUrl === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured')
  }
  return config.apiBaseUrl.replace('/api', '')
}

// --- Service functions ---

export async function getStockByCode(code: string, server: string = 'lindo4', token?: string | null): Promise<Stock> {
  const params = new URLSearchParams({
    code: code,
    server: server,
  });

  const raw = await apiFetch<any>(`/api/stock?${params.toString()}`, {
    token,
    baseUrl: getApiBaseUrlRaw(),
  });

  if (raw.success === false) {
    throw new Error('Stock request failed');
  }

  return raw.stock as Stock;
}
