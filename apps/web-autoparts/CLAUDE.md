# Web Autoparts

E-commerce de autopartes Nami. Usa DOS backends.

## Backends

| Backend | URL prod | URL local | Para qué |
|---------|----------|-----------|----------|
| api_autoparts | https://api-autoparts-ec2.nami.com.uy | http://localhost:8083 | Productos, categorías, búsqueda, stock |
| api_ecommerce | https://api-ecommerce.nami.com.uy/api | http://localhost:8000/api | Carrito, auth Firebase, usuarios |

## Arquitectura de búsqueda

| Búsqueda | Flujo | Endpoint backend |
|----------|-------|-----------------|
| Por texto | Browser → api_autoparts DIRECTO | `POST /search/smart` |
| Por código | Browser → pages/api/products/code → api_autoparts | `/api/productos/buscar-parcial/` |
| Por categoría | Browser → pages/api/autoparts/search → api_autoparts | `/product-type-search/search-by-selection` |
| Categorías | Browser → pages/api/categories → api_autoparts | `/api/tipos-base` + mapper |
| Detalle | Browser → pages/api/products/[id] → api_autoparts | `/api/productos/buscar-codigo/` + mapper |
| Stock | Browser → pages/api/stocks/[id] → api_autoparts | `/api/stock/` SOAP + mapper |

## Pages Router

Usa `pages/` (NO `app/`). API routes en `pages/api/` actúan como **mappers** que transforman datos de api_autoparts al formato Product/Category de `packages/ui`.

## Imágenes

S3: `https://nami-uy.s3.sa-east-1.amazonaws.com/products/{codigo_sin_espacios}.jpg`

## Deploy (Amplify)

App ID: `d3d2sbncpw9si9` | URL: `https://main.d3d2sbncpw9si9.amplifyapp.com`

Variables de entorno requeridas en Amplify:
```
ID=AUTOPARTS
APP_NAME=Nami Autopartes
NEXT_PUBLIC_AUTOPARTS_API_BASE_URL=https://api-autoparts-ec2.nami.com.uy
NEXT_PUBLIC_API_BASE_URL=https://api-ecommerce.nami.com.uy/api
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
PRODUCT_CARD_PRICE_TYPE=WITH_TAX
PRODUCT_DETAIL_PRICE_TYPE=WITH_TAX
PRODUCT_DETAIL_STOCK=true
PRODUCT_CARD_CODE=true
CART_ENABLED=true
AUTH_ENABLED=true
CURRENCY_SYMBOL=$
```

**Importante**: `NEXT_PUBLIC_AUTOPARTS_API_BASE_URL` tiene fallback hardcodeado en `next.config.js` section `env`.

## Levantar

```bash
cd web/apps/web-autoparts
npm run dev    # puerto 3000
```

Requiere api_autoparts en 8083 y api_ecommerce en 8000.

## Notas

- Precios en UYU (pesos), símbolo `$` (no USD)
- Stock: usuarios normales ven tilde/teléfono, sellers ven cantidad por sucursal
- NavBar tiene `disableCategoriesPopover={true}` — no muestra dropdown de categorías
- Theme depende de `ID=AUTOPARTS` — sin ella, no hay colores/estilos
