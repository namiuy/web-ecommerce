# Migración Final: Getters de Variables de Entorno

## Resumen
Esta migración completó la conversión de todos los imports directos de variables de entorno a funciones getter en el proyecto web-nami. Esto permite que las variables se evalúen en tiempo de ejecución (runtime) en lugar de tiempo de compilación (build time), lo cual es necesario para el deployment en AWS Amplify.

## Problema Original
Next.js con `publicRuntimeConfig` requiere que las variables de entorno se accedan mediante `getConfig()` en tiempo de ejecución. Los imports directos causaban errores de compilación porque intentaban acceder a estas variables durante el build.

## Archivos Modificados

### 1. Contact.tsx
**Ubicación**: `packages/ui/templates/Contact.tsx`

**Cambios**:
```typescript
// ANTES
import { branches } from 'shared/env';

export const Contact = () => {
  const toast = useToast();
  const lg = useBreakpointValue({ base: false, lg: true });
  // ... branches se usaba directamente

// DESPUÉS
import { getBranches } from 'shared/env';

export const Contact = () => {
  const toast = useToast();
  const lg = useBreakpointValue({ base: false, lg: true });
  const branches = getBranches();
  // ... ahora branches se obtiene mediante getter
```

**Uso**: El componente Contact usa `branches` para mostrar ubicaciones en un mapa y datos de contacto de cada sucursal.

---

### 2. NavBar/index.tsx
**Ubicación**: `packages/ui/components/NavBar/index.tsx`

**Cambios**:
```typescript
// ANTES
import { multiDomainItems } from 'shared/env';
import { menuItems } from 'shared/env';

export const NavBar = (props: NavBarProps) => {
  // ... usaba multiDomainItems y menuItems directamente

// DESPUÉS
import { getMultiDomainItems, getMenuItems } from 'shared/env';

export const NavBar = (props: NavBarProps) => {
  const isLg = useBreakpointValue({ base: false, lg: true });
  const { fixed, simple } = props;
  const multiDomainItems = getMultiDomainItems();
  const menuItems = getMenuItems();
  // ... ahora se obtienen mediante getters
```

**Uso**: Componente de navegación que muestra menús y enlaces multi-dominio.

---

### 3. PaymentMethods.tsx
**Ubicación**: `packages/ui/components/PaymentMethods.tsx`

**Cambios**:
```typescript
// ANTES
import { getPaymentMethods } from 'shared';
// (ya estaba correcto, pero se verificó)

// DESPUÉS
import { getPaymentMethods } from 'shared';

export const PaymentMethods = () => {
  const paymentMethods = getPaymentMethods();
  // ... usa getter correctamente
```

**Uso**: Muestra íconos de métodos de pago disponibles.

---

### 4. ColorSelector.tsx
**Ubicación**: `packages/ui/components/ColorSelector.tsx`

**Cambios**:
```typescript
// ANTES
import { colors as availableColors } from 'shared';

export const ColorSelector = ({ ... }) => {
  const displayedColors = isEdit
    ? availableColors
    : availableColors.filter(({ id }) => colors.includes(id));

// DESPUÉS
import { getColors } from 'shared';

export const ColorSelector = ({ ... }) => {
  const availableColors = getColors();
  const displayedColors = isEdit
    ? availableColors
    : availableColors.filter(({ id }) => colors.includes(id));
```

**Uso**: Selector de colores para productos.

---

### 5. Entities: Product Type
**Ubicación**: `packages/bff-core/entities/product.ts`

**Cambios**:
```typescript
// ANTES
export type Product = {
  // ... campos existentes
  // faltaban: images, multimedias, stock
};

// DESPUÉS
import { Multimedia } from './multimedia';

export type Product = {
  id: string;
  is_original: boolean;
  is_public: boolean;
  created_at: Date;
  category: Category;
  brand: Brand;
  name: string;
  description: string;
  price: number;
  path?: string;
  image_url: string;
  images?: string[];           // ✅ NUEVO
  multimedias?: Multimedia[];  // ✅ NUEVO
  stock?: 'NO' | 'CO' | 'AV';  // ✅ NUEVO
  specifications: Specification[];
  related_links: RelatedLink[];
  price_without_tax: number;
  discount: number;
  colors: string[];
};
```

**Razón**: El repositorio asignaba estos campos pero no existían en el tipo, causando errores de TypeScript.

---

### 6. Entities: Multimedia Type (NUEVO)
**Ubicación**: `packages/bff-core/entities/multimedia.ts`

**Cambios**:
```typescript
// NUEVO ARCHIVO
export type Multimedia = {
  name: string;
  type: 'photo' | 'video';
  url: string;
};
```

**Exportado en**: `packages/bff-core/entities/index.ts`
```typescript
export * from './multimedia';
```

**Razón**: Necesario para el tipo Product.

---

## Otros Archivos Modificados Previamente

Estos archivos fueron modificados en sesiones anteriores como parte de la misma migración:

### 7. Categories.tsx
```typescript
// Cambio: homeCategories → getHomeCategories()
import { getHomeCategories } from 'shared';
const homeCategories = getHomeCategories();
```

### 8. PaymentMethod.tsx
```typescript
// Cambio: paymentMethods → getPaymentMethods()
import { getPaymentMethods } from 'shared';
const paymentMethods = getPaymentMethods();
```

### 9. ShippingMethod.tsx
```typescript
// Cambio: shippingMethods → getShippingMethods()
import { getShippingMethods } from 'shared';
const shippingMethods = getShippingMethods();
```

### 10. Verification.tsx
```typescript
// Cambio: ambos payment y shipping → getters
import { getShippingMethods, getPaymentMethods } from 'shared';
const shippingMethods = getShippingMethods();
const paymentMethods = getPaymentMethods();
```

### 11. WhatsApp.tsx
```typescript
// Cambio: branches → getBranches()
import { getBranches } from 'shared';
const branches = getBranches();
```

### 12. OrderHistory.tsx
```typescript
// Cambio: paymentMethods → getPaymentMethods()
import { getPaymentMethods } from 'shared';
const paymentMethods = getPaymentMethods();
```

### 13. Checkout.tsx
```typescript
// Cambio: ambos payment y shipping → getters
import { getPaymentMethods, getShippingMethods } from 'shared';
const shippingMethods = getShippingMethods();
const paymentMethods = getPaymentMethods();
```

### 14. SocialNetworks.tsx
```typescript
// Cambio: socialNeworksItems → getSocialNeworksItems()
import { getSocialNeworksItems } from 'shared/env';
const socialNeworksItems = getSocialNeworksItems();
```

---

## Patrón de Migración

### Paso 1: Cambiar Import
```typescript
// ANTES
import { variableName } from 'shared/env';

// DESPUÉS
import { getVariableName } from 'shared/env';
```

### Paso 2: Llamar Getter en Componente
```typescript
// ANTES
export const MyComponent = () => {
  return <div>{variableName}</div>;
};

// DESPUÉS
export const MyComponent = () => {
  const variableName = getVariableName();
  return <div>{variableName}</div>;
};
```

---

## Resultado Final

### ✅ Build Local Exitoso
```bash
npx turbo run build --filter=web-nami --force
```

**Output**:
```
✓ Compiled successfully
✓ Generating static pages (19/19)
Tasks:    2 successful, 2 total
Time:     19.67s
```

### ✅ Errores Resueltos
- ❌ "Module 'shared/env' has no exported member 'branches'"
- ❌ "Module 'shared' has no exported member 'homeCategories'"
- ❌ "Type 'Set<number>' can only be iterated through when using '--downlevelIteration'"
- ❌ "Object literal may only specify known properties, and 'images' does not exist in type 'Product'"

### ✅ Verificación
```bash
grep -r "from 'shared/env'" packages/ui packages/shared apps/web-nami --include="*.tsx" --include="*.ts" | grep -v "get"
```
**Resultado**: Sin matches (todos los imports usan getters)

---

## Deployment a AWS Amplify

### Estado Actual
- ✅ Código compilado localmente sin errores
- ✅ Cambios pusheados a rama `web-tools-api-refactor`
- ✅ Repositorio: `Ignaciort91/web`
- ✅ Amplify configurado con `amplify.yml`

### Próximos Pasos Post-Deployment
1. Obtener URL de Amplify
2. Actualizar CORS en backend FastAPI para incluir URL de Amplify
3. Actualizar variable `SITE_HOST` con URL de Amplify

---

## Commits Relacionados

```bash
# Último commit de esta migración
3732f0f - Fix Contact.tsx to use getBranches() getter

# Commits previos (sesión anterior)
1cfbc23 - Fix remaining env getter imports (NavBar, SocialNetworks, WhatsApp)
[otros commits de la migración]
```

---

## Documentación Relacionada

- `MIGRATION_ENV_GETTERS.md` - Documentación de la primera fase de migración
- `amplify.yml` - Configuración de deployment en Amplify
- `DEPLOYMENT_AMPLIFY.md` - Guía completa de deployment (si existe)

---

**Fecha de migración final**: 2026-03-13
**Build time**: 19.67s
**Total de archivos modificados**: 14+
**Status**: ✅ Completado
