export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '',
  imagesUrl: process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/products',
  brandsUrl: process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL || 'https://nami-uy.s3.sa-east-1.amazonaws.com/brands',
} as const;
