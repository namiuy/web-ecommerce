# API BFF → App Router Refactor — Estado

> Fecha: 2026-03-17 | Branch: `web-tools-api-refactor` | Repo: `/workspace/nami/web`

## Estado general: Fases 1-5 completas (bff-core cleanup parcial — ver Fase 5)

---

## Lo que se hizo (38 archivos nuevos en `apps/web-nami/`)

### Foundation (`lib/`)

| Archivo | Qué hace |
|---------|----------|
| `lib/config.ts` | Env vars: `apiBaseUrl` (API_BASE_URL + /api), `imagesUrl`, `brandsUrl` |
| `lib/api-client.ts` | `apiFetch<TRaw,TResult>()` — shared fetch con timeout 10s, error handling, mapper. `apiFetchList()` para envelopes `{success,count,data}`. Reemplaza los 10 repos duplicados |
| `lib/auth.ts` | `getToken(request)`, `requireToken(request)` — extrae Bearer token del header Authorization (web-standard Request) |
| `lib/errors.ts` | `errorResponse()` (catch-all), `unauthorized()`, `badRequest()`, `notFound()` |

### Services (`lib/services/`) — 11 archivos

| Service | Funciones | Notas |
|---------|-----------|-------|
| `brand.service.ts` | `listBrands()` | Envelope, sort by name, logo_url con brandsUrl |
| `category.service.ts` | `listCategories()` | Envelope, filtra id='-1', sort by name |
| `state.service.ts` | `listStates()` | Array directo (sin envelope), lowercase keys |
| `city.service.ts` | `listCities()` | Array directo (sin envelope), lowercase keys |
| `banner.service.ts` | `listBanners()` | Envelope |
| `product.service.ts` | `searchProducts()`, `getProduct()`, `getRelatedProducts()`, `addProduct()`, `updateProduct()`, `deleteProduct()` | El más complejo: 3 code paths en search (words/filter/list), multimedia/images mapper |
| `cart.service.ts` | `getCart()`, `addToCart()`, `updateCartQuantity()`, `deleteFromCart()` | Envelope `{cart}`, todos POST al backend |
| `order.service.ts` | `listMyOrders()`, `listOrdersByGuid()`, `listAllOrders()`, `checkout()` | Status mapping INI/PCH/PPE/PAP/DIS/CAN |
| `stock.service.ts` | `getStockByCode()` | Usa API_BASE_URL raw (sin /api), availability AV/CO/NO |
| `person.service.ts` | `getPerson()`, `updatePerson()` | Custom response parsing (merges addresses) |
| `user.service.ts` | `registerUser()`, `getUserByFirebaseUid()` | Orquesta sync-user + create person. Guest user on no-token |

### Route Handlers (`app/api/`) — 22 endpoints

| Ruta | Métodos | Auth | Service |
|------|---------|------|---------|
| `/api/healthcheck` | GET | - | inline |
| `/api/brands` | GET | - | brand |
| `/api/categories` | GET | - | category |
| `/api/states` | GET | - | state |
| `/api/cities` | GET | - | city |
| `/api/banners` | GET | - | banner |
| `/api/product-lists` | GET | - | inline (returns []) |
| `/api/products/search` | GET | optional | product |
| `/api/products` | POST | required | product |
| `/api/products/[id]` | GET, PUT, DELETE | GET=optional, PUT/DELETE=required | product |
| `/api/products/related/[id]` | GET | optional | product |
| `/api/cart` | GET, POST, PUT, DELETE | required | cart |
| `/api/orders` | GET, POST | required | order |
| `/api/orders/all` | GET | required | order |
| `/api/orders/status-change` | POST | required | proxy |
| `/api/stocks/[id]` | GET | optional | stock |
| `/api/person` | GET, PUT | required | person |
| `/api/users` | POST | - | user |
| `/api/users/[uid]` | GET | optional (guest on no-token) | user |
| `/api/newsletter/subscribe` | POST | - | proxy |
| `/api/contact/email` | POST | - | proxy |
| `/api/quotes/request` | POST | - | proxy |

Todas las URLs matchean exacto el contrato del frontend (`packages/shared/hooks/request/*`).

---

## Fase 5 — Cleanup (COMPLETADA 2026-03-20)

### Lo que se eliminó

1. **`apps/web-nami/pages/api/`** — directorio completo eliminado (18 archivos)
   - 16 endpoints: banners, brands, cart, categories, cities, healthcheck, orders, person, product-lists, products/[id], products/search, products/related/[id], states, stocks/[id], users, users/[uid]
   - 2 helpers internos: `_config.ts`, `_helpers.ts`
   - Todos los 16 endpoints tienen equivalente en `app/api/` (verificado 1:1)

2. **`apps/web-nami/repositories/fastapi/`** — directorio completo eliminado (10 archivos)
   - banner, brand, cart, category, city, order, person, product, state repositories + index
   - Reemplazados por `lib/services/` + `lib/api-client.ts`
   - Verificado: solo `pages/api/` los importaba (via `_config.ts`)

3. **`apps/web-nami/usecases/`** — directorio completo eliminado (16 archivos)
   - banner, brand, cart, category, city, order, person, product, state, stock use cases
   - Todos eran pass-through (delegaban a repositories sin lógica adicional)
   - Verificado: solo `pages/api/` los importaba — ningún componente frontend los usaba

### Lo que NO se eliminó (y por qué)

4. **`packages/bff-core` se mantuvo intacto** — NO se eliminaron repositories/ ni types/
   - `apps/web-control-panel/` depende fuertemente de bff-core repositories/ y types/ (28 imports)
   - Importa: `Result`, `createSuccessResult`, `createErrorResult`, `IXxxRepository`, `createStockRepository`, `UNAUTHORIZED`, `httpStatus`, `isError`, `isSuccess`
   - Eliminar repositories/ y types/ rompería web-control-panel
   - Se deja para cuando web-control-panel haga su propio refactor

### Verificación de imports

- `grep -r "repositories/fastapi" apps/web-nami/` → 0 resultados
- `grep -r "usecases/" apps/web-nami/` → 0 resultados
- `grep -r "_config" apps/web-nami/pages/` → no existe pages/api/
- `grep -r "_helpers" apps/web-nami/pages/` → no existe pages/api/
- Frontend (`packages/shared/hooks/request/*`) no importaba nada de lo eliminado
- `packages/shared` y `packages/ui` solo importan `Checkout` de `@namiuy/bff-core` (entidad, no afectada)

### Pendiente

- Verificar funcionalidad levantando con `npm run dev:nami` y probando endpoints con curl
- Cleanup de `packages/bff-core` repositories/ y types/ queda pendiente hasta refactor de web-control-panel

---

## Archivos de referencia

| Archivo | Para qué |
|---------|----------|
| `/workspace/nami/01-migracion-api-bff.md` | Doc de best practices (patrones, errores comunes) |
| `packages/shared/hooks/request/*` | Contrato de URLs del frontend |
| `packages/shared/utils/fetcher.ts` | Cómo el frontend inyecta auth token (lscache firebase_token) |
| `apps/web-nami/next.config.js` | basePath y config (no se tocó) |

## Decisiones tomadas

- **App Router solo para API** — Pages Router sigue para UI, coexisten
- **Sin imports de @namiuy/bff-core** — todos los tipos definidos inline en services
- **Imports relativos** — tsconfig no tiene `@/*` alias configurado
- **Sin versionado /api/v1/** — matchea URLs existentes del frontend
- **`app/layout.tsx` mínimo** — solo `return children` para que App Router funcione
