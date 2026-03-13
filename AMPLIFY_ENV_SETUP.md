# AWS Amplify - Configuración de Variables de Entorno

## Problema
El deployment en Amplify falla con errores 500 en `/api/categories`, `/api/brands`, etc. porque faltan las variables de entorno necesarias.

## Solución

Ve a **AWS Amplify Console** → Tu App → **Environment variables** y agrega TODAS estas variables:

**IMPORTANTE**: Después de agregar las variables, es obligatorio hacer un redeploy para que surtan efecto.

### Variables Requeridas

```bash
# Backend API Configuration
API_BASE_URL=http://3.80.25.147:8000
API_PATH=/api
NEXT_PUBLIC_API_BASE_URL=http://3.80.25.147:8000

# AWS S3 URLs
IMAGES_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/products
BRANDS_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/brands

# Application Configuration
ID=TOOLS
APP_NAME=Nami Herramientas
SITE_HOST=https://your-amplify-url.amplifyapp.com
NODE_ENV=production

# Product Display Settings
PRODUCT_CARD_PRICE_TYPE=WITH_TAX
PRODUCT_CARD_CODE=true
PRODUCT_DETAIL_PRICE_TYPE=with_tax
PRODUCT_DETAIL_RELATED_PRODUCTS=true
PRODUCT_DETAIL_STOCK=true
PRODUCT_PAGINATION=true

# Feature Flags
CART_ENABLED=true
AUTH_ENABLED=true

# Payment Methods (comma-separated IDs)
PAYMENT_METHODS=SADE,ITDE,ABGI

# Google Services
GOOGLE_MAP_API_KEY=AIzaSyDbvySzv-lSHVtnc4iCNEt-MidCiEkwqI8
GOOGLE_GA_MEASUREMENT_ID=AIzaSyCxeKqoZ3IK-xL08kG4XfzWEgyHy1WIVG8

# Navbar Message (optional)
NAVBAR_MESSAGE=

# Firebase Configuration (NEXT_PUBLIC_ prefix required for client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAlOZgc5byJrLQG64CxNn-oKQErr6t8fvE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-6245b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-6245b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-6245b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=994123103016
NEXT_PUBLIC_FIREBASE_APP_ID=1:994123103016:web:34bfc69402b07230ac2e1d
```

## Pasos para Configurar

### 1. Ve a AWS Amplify Console
```
https://console.aws.amazon.com/amplify/
```

### 2. Selecciona tu App
- Click en tu aplicación
- Selecciona el branch `web-tools-api-refactor`

### 3. Agrega las Variables de Entorno
- En el menú lateral, click en **"Environment variables"**
- Click en **"Manage variables"**
- Para cada variable de arriba:
  - Click **"Add variable"**
  - En "Variable name": pega el nombre (ej: `API_BASE_URL`)
  - En "Value": pega el valor (ej: `http://3.80.25.147:8000`)
  - Repeat for ALL variables

### 4. Guarda los Cambios
- Click **"Save"**

### 5. Redeploy
- Ve a la pestaña **"Build history"**
- Click en **"Redeploy this version"** del último build
- O simplemente hace un push a la rama `web-tools-api-refactor`

## Verificación Post-Deployment

Una vez que el build finalice:

1. **Abre la URL de Amplify**
2. **Abre la consola del navegador** (F12)
3. **Verificá que NO haya errores** de tipo:
   - `Failed to load resource: 500`
   - `m.map is not a function`

Si todo está correcto, deberías ver:
- ✅ La página carga correctamente
- ✅ Las categorías se muestran
- ✅ Los productos se cargan
- ✅ No hay errores 500 en la consola

## Próximos Pasos

Después de verificar que funciona:

1. **Actualiza SITE_HOST** con la URL real de Amplify:
   ```
   SITE_HOST=https://tu-app-id.amplifyapp.com
   ```

2. **Actualiza CORS en el backend** FastAPI para permitir requests desde Amplify:
   ```python
   # En api_ecommerce/app/main.py
   origins = [
       "http://localhost:3000",
       "https://tu-app-id.amplifyapp.com",  # <- AGREGAR ESTA
   ]
   ```

3. **Redeploy nuevamente** después de actualizar SITE_HOST

## Troubleshooting

### Error: "m.map is not a function"
**Causa**: Variables de entorno no configuradas o `publicRuntimeConfig` vacío
**Solución**: Verificá que TODAS las variables estén configuradas

### Error 500 en /api/categories
**Causa**: `API_BASE_URL` o `API_PATH` incorrectos
**Solución**: Verificá que:
- `API_BASE_URL=http://3.80.25.147:8000`
- `API_PATH=/api`

### Página en blanco
**Causa**: `ID` o `APP_NAME` no configurados
**Solución**: Verificá que:
- `ID=TOOLS`
- `APP_NAME=Nami Herramientas`

### Firebase Auth no funciona
**Causa**: Variables `NEXT_PUBLIC_FIREBASE_*` faltantes
**Solución**: Verificá que TODAS las variables de Firebase estén configuradas con el prefijo `NEXT_PUBLIC_`

## Notas Importantes

- ⚠️ Las variables con prefijo `NEXT_PUBLIC_` son accesibles desde el cliente (navegador)
- ⚠️ Las variables sin prefijo solo son accesibles desde el servidor (API routes)
- ⚠️ Después de cambiar variables, SIEMPRE es necesario hacer redeploy
- ⚠️ Amplify NO usa `.env.local` ni `.env.production` automáticamente - las variables deben configurarse en la consola

## Referencias

- [Amplify Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Runtime Configuration](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)
