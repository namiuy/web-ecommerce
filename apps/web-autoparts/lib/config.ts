// Getter function that reads env vars on EVERY access (for serverless)
export const config = {
  get apiBaseUrl() {
    return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''
  },
  get autopartsApiBaseUrl() {
    return process.env.NEXT_PUBLIC_AUTOPARTS_API_BASE_URL || 'http://localhost:8083'
  },
  get imagesUrl() {
    return process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/products'
  },
  get brandsUrl() {
    return process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/brands'
  }
}
