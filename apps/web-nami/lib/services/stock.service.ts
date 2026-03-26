import { apiFetch } from '../api-client';
import type { Stock } from 'shared/entities/stock';

// --- Stock base URL (raw API_BASE_URL without /api path) ---

const stockBaseUrl = process.env.API_BASE_URL_RAW || 'http://localhost:8000';

// --- Service functions ---

export async function getStockByCode(code: string, server: string = 'lindo4', token?: string | null): Promise<Stock> {
  const params = new URLSearchParams({
    code: code,
    server: server,
  });

  const raw = await apiFetch<any>(`/api/stock?${params.toString()}`, {
    token,
    baseUrl: stockBaseUrl,
  });

  if (raw.success === false) {
    throw new Error('Stock request failed');
  }

  return raw.stock as Stock;
}
