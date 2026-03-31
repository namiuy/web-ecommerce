import { apiFetch } from '../api-client';
import type { Stock } from 'shared/entities/stock';
import { config } from '../config';

// --- Service functions ---

export async function getStockByCode(code: string, server: string = 'lindo4', token?: string | null): Promise<Stock> {
  const params = new URLSearchParams({
    code: code,
    server: server,
  });

  // config.apiBaseUrl already includes /api path, so use /stock endpoint
  const raw = await apiFetch<any>(`/stock?${params.toString()}`, {
    token,
    baseUrl: config.apiBaseUrl,
  });

  if (raw.success === false) {
    throw new Error('Stock request failed');
  }

  return raw.stock as Stock;
}
