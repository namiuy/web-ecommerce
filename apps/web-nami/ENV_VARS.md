# Environment Variables Configuration

This document describes the required environment variables for the web-nami application.

## Required Variables

### `NEXT_PUBLIC_API_BASE_URL`

**Description:** Base URL for the backend API (including `/api` path)

**Required:** Yes

**Example:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://api-ecommerce.nami.com.uy/api
```

**Notes:**
- This is the ONLY required API URL variable
- The `NEXT_PUBLIC_` prefix makes it available in both client and server contexts
- Must include the `/api` path suffix
- Used by all Next.js API Routes and services

## Deprecated Variables

The following variables are **NO LONGER NEEDED** and should not be configured:

- ❌ `API_BASE_URL` - Redundant, use `NEXT_PUBLIC_API_BASE_URL` instead
- ❌ `API_BASE_URL_RAW` - Not used in code

## Optional Variables

### Image URLs

```bash
NEXT_PUBLIC_IMAGES_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/products
NEXT_PUBLIC_BRANDS_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/brands
```

**Fallback:** If not set, uses hardcoded S3 URLs

## Amplify Configuration

In AWS Amplify, configure **only**:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

All other variables have sensible defaults.

## Troubleshooting

If you see errors like:
```
Error: NEXT_PUBLIC_API_BASE_URL is not configured
```

Make sure you have set `NEXT_PUBLIC_API_BASE_URL` in your environment (Amplify console > App settings > Environment variables).
