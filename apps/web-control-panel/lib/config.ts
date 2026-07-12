// Getter function that reads env vars on EVERY access (for serverless)
export const config = {
  get apiBaseUrl() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''
    // If base already ends with /api, don't append API_PATH again
    if (base.endsWith('/api')) return base
    const path = process.env.API_PATH || '/api'
    return `${base}${path}`
  },
  get apiBaseUrlRaw() {
    return process.env.API_BASE_URL_RAW || process.env.API_BASE_URL || ''
  },
  get imagesUrl() {
    return process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL || 'https://robotec-uy.s3.sa-east-1.amazonaws.com/products'
  },
  get brandsUrl() {
    return process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL || 'https://robotec-uy.s3.sa-east-1.amazonaws.com/brands'
  },
}
