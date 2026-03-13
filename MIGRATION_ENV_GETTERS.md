# Migración a Environment Getters

## Resumen

Se realizó una migración completa del sistema de configuración de entorno para solucionar errores de build en AWS Amplify. El problema principal era que `getConfig()` de Next.js no está disponible durante la fase de build estático, causando errores como:

```
Type error: '"shared"' has no exported member named 'cartEnabled'. Did you mean 'getCartEnabled'?
```

## Problema Original

### Código Anterior (❌)

```typescript
// packages/shared/env.ts
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
export const envId = publicRuntimeConfig.envId;
export const keys = publicRuntimeConfig.keys;
export const cartEnabled = publicRuntimeConfig.cartEnabled;
// etc...
```

**Problema**: `getConfig()` se ejecutaba en el nivel del módulo durante el build, pero `publicRuntimeConfig` no está disponible en tiempo de build estático.

## Solución Implementada

### Nuevo Código (✅)

```typescript
// packages/shared/env.ts

// Lazy getter para evitar ejecución en build-time
let _prc: any = null;
const getPrc = () => {
  if (_prc === null) {
    try {
      const { publicRuntimeConfig } = getConfig();
      _prc = publicRuntimeConfig || {};
    } catch (error) {
      console.warn('getConfig() not available, using empty config');
      _prc = {};
    }
  }
  return _prc;
};

// Exportar funciones getter
export const getEnvId = () => getPrc().envId;
export const getKeys = () => getPrc().keys as Keys;
export const getCartEnabled = () => getPrc().cartEnabled as boolean;
export const getAuthEnabled = () => getPrc().authEnabled as boolean;
export const getSiteHost = () => getPrc().siteHost;
export const getProduct = () => getPrc().product as Product;
export const getProductFormPhotoUpload = () => getPrc().productFormPhotoUpload as boolean;
export const getNavbarMessage = () => getPrc().navbarMessage;
// ... etc

// Legacy exports con Object.defineProperty para backwards compatibility
Object.defineProperty(module.exports || exports, 'envId', {
  get() {
    if (_envId === undefined) _envId = getPrc().envId;
    return _envId;
  },
  enumerable: true
});
// ... etc
```

## Archivos Modificados

### 1. Apps - web-nami

#### `apps/web-nami/pages/productos/[id].tsx`

**Antes:**
```typescript
import { cartEnabled } from 'shared';

// ...uso directo
actions={cartEnabled ? ['add_to_cart'] : ['whatsapp_request']}
```

**Después:**
```typescript
import { getCartEnabled } from 'shared';

// ...uso con función
actions={getCartEnabled() ? ['add_to_cart'] : ['whatsapp_request']}
```

---

### 2. Packages UI - Templates

#### `packages/ui/templates/ProductDetail.tsx`

**Antes:**
```typescript
import { useProductGet, product as productConf, cartEnabled } from 'shared';
const { detailPriceType, showRelatedProducts, showStock } = productConf;
```

**Después:**
```typescript
import { useProductGet, getProduct, getCartEnabled } from 'shared';
const productConf = getProduct();
const { detailPriceType, showRelatedProducts, showStock } = productConf;
const cartEnabled = getCartEnabled();
```

---

### 3. Packages UI - Components

#### `packages/ui/components/WhatsAppRequestButton.tsx`

**Antes:**
```typescript
import { siteHost } from 'shared';

href={`https://wa.me/598091033282/?text=...${siteHost}${product?.path}`}
```

**Después:**
```typescript
import { getSiteHost } from 'shared';

href={`https://wa.me/598091033282/?text=...${getSiteHost()}${product?.path}`}
```

---

#### `packages/ui/components/NavBar/NavBarMobile.tsx`

**Antes:**
```typescript
import { cartEnabled, useCurrentUser } from 'shared';

{user && cartEnabled && (
  <GridItem>
    <ShoppingCartDrawer />
  </GridItem>
)}
```

**Después:**
```typescript
import { getCartEnabled, useCurrentUser } from 'shared';

{user && getCartEnabled() && (
  <GridItem>
    <ShoppingCartDrawer />
  </GridItem>
)}
```

---

#### `packages/ui/components/NavBar/NavBarDesktopFull.tsx`

**Antes:**
```typescript
import { authEnabled, cartEnabled, useCurrentUser } from 'shared';
import { navbarMessage } from 'shared';

{authEnabled && (
  <GridItem pl="1rem">
    <MenuAdmin />
  </GridItem>
)}
{user && cartEnabled && (
  <GridItem>
    <ShoppingCartDrawer />
  </GridItem>
)}
<Text>{navbarMessage}</Text>
```

**Después:**
```typescript
import { getAuthEnabled, getCartEnabled, useCurrentUser, getNavbarMessage } from 'shared';

{getAuthEnabled() && (
  <GridItem pl="1rem">
    <MenuAdmin />
  </GridItem>
)}
{user && getCartEnabled() && (
  <GridItem>
    <ShoppingCartDrawer />
  </GridItem>
)}
<Text>{getNavbarMessage()}</Text>
```

---

#### `packages/ui/components/Map.tsx`

**Antes:**
```typescript
import { keys } from 'shared';

const { googleMapsApiKey } = keys;
```

**Después:**
```typescript
import { getKeys } from 'shared';

const { googleMapsApiKey } = getKeys();
```

---

#### `packages/ui/components/MenuAdmin.tsx`

**Antes:**
```typescript
import { cartEnabled, useCurrentUser } from 'shared';

{cartEnabled && (
  <MenuItem icon={<FaShoppingBag />} onClick={handleOrderHistory}>
    Mis compras
  </MenuItem>
)}
```

**Después:**
```typescript
import { getCartEnabled, useCurrentUser } from 'shared';

{getCartEnabled() && (
  <MenuItem icon={<FaShoppingBag />} onClick={handleOrderHistory}>
    Mis compras
  </MenuItem>
)}
```

---

#### `packages/ui/components/ProductCard.tsx`

**Antes:**
```typescript
import { product as productConf } from 'shared';
const { showCod, cardPriceType, showStock } = productConf;
```

**Después:**
```typescript
import { getProduct } from 'shared';
const productConf = getProduct();
const { showCod, cardPriceType, showStock } = productConf;
```

---

#### `packages/ui/components/ProductCardCarousel.tsx`

**Antes:**
```typescript
import { product as productConf } from 'shared';
const { showCod } = productConf;
```

**Después:**
```typescript
import { getProduct } from 'shared';
const productConf = getProduct();
const { showCod } = productConf;
```

---

#### `packages/ui/components/ProductForm.tsx`

**Antes:**
```typescript
import { product as productConf, productFormPhotoUpload } from 'shared';
const { showColors } = productConf;
```

**Después:**
```typescript
import { getProduct, getProductFormPhotoUpload } from 'shared';
const productConf = getProduct();
const { showColors } = productConf;
const productFormPhotoUpload = getProductFormPhotoUpload();
```

---

#### `packages/ui/components/ProductSearch.tsx`

**Antes:**
```typescript
import { getEmptyArray, useProductSearch, isBrowser, product as productConf } from 'shared';
const { showPagination } = productConf;
```

**Después:**
```typescript
import { getEmptyArray, useProductSearch, isBrowser, getProduct } from 'shared';
const productConf = getProduct();
const { showPagination } = productConf;
```

---

## Tabla de Mapeo de Imports

| Import Anterior | Import Nuevo | Uso Anterior | Uso Nuevo |
|----------------|--------------|--------------|-----------|
| `cartEnabled` | `getCartEnabled` | `cartEnabled` | `getCartEnabled()` |
| `authEnabled` | `getAuthEnabled` | `authEnabled` | `getAuthEnabled()` |
| `siteHost` | `getSiteHost` | `siteHost` | `getSiteHost()` |
| `keys` | `getKeys` | `keys.googleMapsApiKey` | `getKeys().googleMapsApiKey` |
| `product as productConf` | `getProduct` | `productConf.showCod` | `getProduct().showCod` |
| `productFormPhotoUpload` | `getProductFormPhotoUpload` | `productFormPhotoUpload` | `getProductFormPhotoUpload()` |
| `navbarMessage` | `getNavbarMessage` | `navbarMessage` | `getNavbarMessage()` |
| `envId` | `getEnvId` | `envId` | `getEnvId()` |
| `appName` | `getAppName` | `appName` | `getAppName()` |

## Funciones Getter Disponibles

Todas las funciones getter están exportadas desde `packages/shared/env.ts`:

```typescript
export const getBff = () => getPrc().bffUrl;
export const getEnvId = () => getPrc().envId;
export const getAppName = () => getPrc().appName;
export const getSiteHost = () => getPrc().siteHost;
export const getKeys = () => getPrc().keys as Keys;
export const getBranches = () => getPrc().branches as Branch[];
export const getCartEnabled = () => getPrc().cartEnabled as boolean;
export const getAuthEnabled = () => getPrc().authEnabled as boolean;
export const getProductFormPhotoUpload = () => getPrc().productFormPhotoUpload as boolean;
export const getMultiDomainItems = () => getPrc().multiDomainItems as MultiDomainItem[];
export const getPaymentMethods = () => getPrc().paymentMethods as PaymentMethod[];
export const getShippingMethods = () => getPrc().shippingMethods as ShippingMethod[];
export const getHomeCategories = () => getPrc().homeCategories as HomeCategory[];
export const getMenuItems = () => getPrc().menuItems as MenuItem[];
export const getSocialNeworksItems = () => getPrc().socialNeworksItems as SocialNeworkItem[];
export const getProduct = () => getPrc().product as Product;
export const getColors = () => getPrc().colors as Color[];
export const getNavbarMessage = () => getPrc().navbarMessage;
```

## Beneficios de la Migración

1. **✅ Build exitoso en Amplify**: Los getters no se ejecutan durante el build estático
2. **✅ Lazy loading**: La configuración se carga solo cuando se necesita
3. **✅ Manejo de errores**: Fallback a configuración vacía si `getConfig()` no está disponible
4. **✅ Backwards compatibility**: Los exports legacy siguen funcionando con `Object.defineProperty`
5. **✅ Type safety**: Todas las funciones tienen tipos TypeScript

## Archivos Eliminados

Como parte de la migración a AWS Amplify, se eliminaron archivos específicos de Vercel:

- `.vercelignore`
- `VERCEL_DEPLOYMENT.md`
- `VERCEL_ENV_VARS.md`
- `vercel.json`
- `Dockerfile` (no necesario para Amplify)

## Testing

Para verificar que todo funciona correctamente:

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Dev local**:
   ```bash
   npm run dev
   ```

3. **Build en Amplify**:
   - Push a `web-tools-api-refactor` branch
   - Amplify detecta automáticamente y ejecuta build
   - Verificar logs en AWS Amplify Console

## Notas Importantes

- **No usar imports directos**: Siempre usar las funciones getter
- **Llamar las funciones**: Recordar agregar `()` al usar los getters
- **Module-level execution**: Evitar llamar getters en el nivel del módulo, preferir dentro de componentes o funciones
- **Legacy compatibility**: Los exports antiguos siguen funcionando pero se recomienda migrar a getters

## Commits Relacionados

- `Fix Amplify monorepo configuration` - Arreglo de `amplify.yml`
- `Remove Dockerfile - not needed for Amplify deployment`
- `Fix all module-level env imports to use getter functions` - Migración completa a getters

---

**Fecha**: 2026-03-13
**Autor**: Claude Code
**Deployment Target**: AWS Amplify
