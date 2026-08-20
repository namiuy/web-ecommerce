import { config } from '../config';
import type { StockDetail } from '../../components/busqueda-total/types';

const API = () => config.autopartsApiBaseUrl;
const S3_BASE = 'https://nami-uy.s3.sa-east-1.amazonaws.com/products';

// --- Parque (cascade dropdowns) ---

export const getParqueParts = async (): Promise<{ id: number; label: string }[]> => {
  const res = await fetch(`${API()}/parque/parts`);
  return res.json();
};

export const getParqueAllBrands = async (): Promise<string[]> => {
  const res = await fetch(`${API()}/parque/brands`);
  return res.json();
};

export const getParqueBrandsByPart = async (part: string): Promise<string[]> => {
  const res = await fetch(`${API()}/parque/brands-by-part?part=${encodeURIComponent(part)}`);
  return res.json();
};

export const getParqueModelsByPart = async (brand: string, part: string): Promise<string[]> => {
  const res = await fetch(`${API()}/parque/models-by-part?brand=${encodeURIComponent(brand)}&part=${encodeURIComponent(part)}`);
  return res.json();
};

export const getParqueModelsByBrand = async (brand: string): Promise<string[]> => {
  const res = await fetch(`${API()}/parque/models-by-brand?brand=${encodeURIComponent(brand)}`);
  return res.json();
};

export const getParqueVehiclesByPart = async (brand: string, model: string, part: string, limit = 200): Promise<any[]> => {
  const params = new URLSearchParams({ brand, model, part, limit: String(limit) });
  const res = await fetch(`${API()}/parque/vehicles-by-part?${params}`);
  return res.json();
};

// --- Search ---

export const smartSearch = async (query: string, limit = 500, tipo_producto?: string): Promise<any[]> => {
  const body: any = { query, limit };
  if (tipo_producto) body.tipo_producto = tipo_producto;
  const res = await fetch(`${API()}/search/smart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const searchByCode = async (code: string, limit = 200): Promise<any[]> => {
  const res = await fetch(`${API()}/api/productos/buscar-parcial/${encodeURIComponent(code)}?limit=${limit}`);
  const data = await res.json();
  return data.productos || data || [];
};

export const searchByBrandModel = async (brand: string, model: string): Promise<any[]> => {
  const params = new URLSearchParams({ brand, model });
  const res = await fetch(`${API()}/product-type-search/search-by-brand-model?${params}`);
  return res.json();
};

// --- Family detail ---

export const getFamiliaById = async (id: number): Promise<any> => {
  const res = await fetch(`${API()}/api/familias-autoparte/${id}`);
  return res.json();
};

export const fetchStockDetail = async (code: string): Promise<StockDetail> => {
  try {
    const res = await fetch(`${API()}/api/stock/${encodeURIComponent(code.trimEnd())}?servidor=lindo4`, {
      signal: AbortSignal.timeout(15000),
    });
    const d = await res.json();
    return {
      total: d.total || 0,
      stockNami: d.stockNami || 0,
      stockClima: d.stockClima || 0,
      stockSircal: d.stockSircal || 0,
      stockLafelor: d.stockLafelor || 0,
      stockAlodenar: d.stockAlodenar || 0,
    };
  } catch {
    return { total: 0, stockNami: 0, stockClima: 0, stockSircal: 0, stockLafelor: 0, stockAlodenar: 0 };
  }
};

// --- Image ---

export const getImageUrl = (code: string): string => {
  const clean = code.split(' ')[0];
  return `${S3_BASE}/${clean}.jpg`;
};
