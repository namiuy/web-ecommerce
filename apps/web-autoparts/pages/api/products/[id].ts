import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductByCode } from '../../../lib/services/product.service'
import { config } from '../../../lib/config'

/**
 * Maps raw api_autoparts product data to the Product/Autopart format
 * that the frontend components expect.
 */
function mapAutopartToProduct(raw: any) {
  const code = raw.code || raw.Codigo || ''
  const description = raw.original_code || raw.CodigoOriginal || raw.description || ''
  const vehicleBrand = raw.vehicle_brand || raw.MarcaVehiculo || ''
  const vehicleName = raw.vehicle_name || raw.Vehiculo || ''
  const engine = raw.engine || raw.Motor || ''
  const year = raw.year || raw.Ano || ''
  const productType = raw.product_type_name || raw.TipoProductoNombre || ''
  const supplierName = raw.supplier_name || raw.ProveedorNombre || ''
  const price = raw.list_price || raw.PrecioLista || raw.price || 0
  const height = raw.height || raw.Alto || ''
  const width = raw.width || raw.Ancho || ''
  const system = raw.system || raw.Sistema || ''
  const family = raw.family || raw.Familia || ''
  const groupCode = raw.group_code || ''
  const notes = raw.notes || raw.Observacion || ''

  // Image from S3: use first part of code (before space) + .jpg
  const imageBase = code.split(' ')[0]
  const imageUrl = imageBase ? `${config.imagesUrl}/${imageBase}.jpg` : ''

  // Build specifications from dimensions
  const specifications: any[] = []
  if (height) specifications.push({ name: 'Alto', value: height })
  if (width) specifications.push({ name: 'Ancho', value: width })
  if (system) specifications.push({ name: 'Sistema', value: system })

  // Build application from vehicle info
  const applications: any[] = []
  if (vehicleBrand || vehicleName) {
    applications.push({
      brand: { id: vehicleBrand, name: vehicleBrand },
      name: vehicleName.trim(),
      year_range: year || '',
      engine: engine,
    })
  }

  // Build products array (for stock display)
  const products = [{
    id: code,
    price: price,
    price_without_tax: price / 1.22, // IVA 22%
    discount: 0,
    specifications,
  }]

  const displayName = `${productType} ${vehicleBrand} ${vehicleName}`.trim()

  return {
    id: code,
    name: displayName,
    description: description || displayName,
    notes,
    brand: { id: vehicleBrand, name: vehicleBrand },
    category: { id: productType, name: productType },
    price,
    price_without_tax: price / 1.22,
    discount: 0,
    image_url: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    path: `/productos/${encodeURIComponent(code)}`,
    stock: 'CO' as const,
    specifications,
    related_links: [],
    colors: [],
    is_original: false,
    is_public: raw.public || raw.Publico || true,
    created_at: new Date(),
    applications,
    products,
    family: family.trim(),
    group_code: groupCode,
    supplier: supplierName,
    product_type_name: productType,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' })
    }
    const raw = await getProductByCode(id)
    const product = mapAutopartToProduct(raw)
    res.json(product)
  } catch (error: any) {
    console.error('[api/products/[id]]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
