export const config = {
  apiBaseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL}`,
  imagesUrl: process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL,
  brandsUrl: process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL,
} as const;
