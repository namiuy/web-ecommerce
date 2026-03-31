// Function to get config at runtime (for serverless environments)
function getConfig() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''
  const imagesUrl = process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/products'
  const brandsUrl = process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/brands'

  // Debug logging
  console.log('[config] NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
  console.log('[config] API_BASE_URL:', process.env.API_BASE_URL)
  console.log('[config] Final apiBaseUrl:', apiBaseUrl)

  return {
    apiBaseUrl,
    imagesUrl,
    brandsUrl,
  }
}

// Export as getter for runtime access
export const config = getConfig()
