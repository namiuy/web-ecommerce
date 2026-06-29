/* eslint-disable turbo/no-undeclared-env-vars */
import getConfig from 'next/config'

function getServerConfig() {
  try {
    const { serverRuntimeConfig } = getConfig() || {}
    return serverRuntimeConfig || {}
  } catch {
    return {}
  }
}

// Getter function: tries serverRuntimeConfig first (works in Amplify Lambda),
// then falls back to process.env (works in local dev)
export const config = {
  get apiBaseUrl() {
    return getServerConfig().apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''
  },
  get autopartsApiBaseUrl() {
    return getServerConfig().autopartsApiBaseUrl || process.env.AUTOPARTS_API_BASE_URL || 'http://localhost:8083'
  },
  get imagesUrl() {
    return getServerConfig().imagesUrl || process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/products'
  },
  get brandsUrl() {
    return process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/brands'
  }
}
