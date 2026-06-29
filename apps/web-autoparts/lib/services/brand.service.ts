import { apiFetch } from '../api-client'
import { config } from '../config'
import type { Brand } from 'shared/entities/brand'

const BASE = config.autopartsApiBaseUrl

/**
 * Lists all brands from api_autoparts.
 * Since api_autoparts doesn't have a standalone brands list,
 * this returns an empty array. Brands are fetched per product type
 * via getBrandsByProductType() in product.service.ts.
 */
export async function listBrands(): Promise<Brand[]> {
  return []
}
