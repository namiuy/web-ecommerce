# AWS Amplify - Variables de Entorno con HTTPS

Última actualización: 2026-03-13

## IMPORTANTE: Actualizar a HTTPS

El backend ahora tiene SSL/TLS configurado con Let's Encrypt. Actualiza las siguientes variables en Amplify:

### Variables a ACTUALIZAR

```bash
# Backend API Configuration - CAMBIAR A HTTPS
API_BASE_URL=https://apis-app-dev.nami.com.uy
NEXT_PUBLIC_API_BASE_URL=https://apis-app-dev.nami.com.uy

# API Path (sin cambios)
API_PATH=/api
```

### Variables que NO cambian

Todas las demás variables permanecen igual:

```bash
# AWS S3 URLs (sin cambios)
IMAGES_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/products
BRANDS_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/brands

# Application Configuration (sin cambios)
ID=TOOLS
APP_NAME=Nami Herramientas
SITE_HOST=https://web-tools-api-refactor.d211yreubl40su.amplifyapp.com
NODE_ENV=production

# Product Display Settings (sin cambios)
PRODUCT_CARD_PRICE_TYPE=WITH_TAX
PRODUCT_CARD_CODE=true
PRODUCT_DETAIL_PRICE_TYPE=with_tax
PRODUCT_DETAIL_RELATED_PRODUCTS=true
PRODUCT_DETAIL_STOCK=true
PRODUCT_PAGINATION=true

# Feature Flags (sin cambios)
CART_ENABLED=true
AUTH_ENABLED=true

# Payment Methods (sin cambios)
PAYMENT_METHODS=SADE,ITDE,ABGI

# Google Services (sin cambios)
GOOGLE_MAP_API_KEY=AIzaSyDbvySzv-lSHVtnc4iCNEt-MidCiEkwqI8
GOOGLE_GA_MEASUREMENT_ID=AIzaSyCxeKqoZ3IK-xL08kG4XfzWEgyHy1WIVG8

# Navbar Message (sin cambios)
NAVBAR_MESSAGE=

# Firebase Configuration (sin cambios)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAlOZgc5byJrLQG64CxNn-oKQErr6t8fvE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-6245b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-6245b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-6245b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=994123103016
NEXT_PUBLIC_FIREBASE_APP_ID=1:994123103016:web:34bfc69402b07230ac2e1d
```

## Pasos para Actualizar

### 1. Ve a AWS Amplify Console
```
https://console.aws.amazon.com/amplify/
```

### 2. Selecciona tu App
- Click en tu aplicación
- Selecciona el branch `web-tools-api-refactor`

### 3. Actualiza las Variables
- En el menú lateral, click en **"Environment variables"**
- Click en **"Manage variables"**
- Busca `API_BASE_URL` y cambia el valor a: `https://apis-app-dev.nami.com.uy`
- Busca `NEXT_PUBLIC_API_BASE_URL` y cambia el valor a: `https://apis-app-dev.nami.com.uy`
- Click **"Save"**

### 4. Redeploy
- Ve a la pestaña **"Build history"**
- Click en **"Redeploy this version"** del último build
- O simplemente hace un push a la rama `web-tools-api-refactor`

## Verificación Post-Deployment

Una vez que el build finalice:

1. **Abre la URL de Amplify**: https://web-tools-api-refactor.d211yreubl40su.amplifyapp.com
2. **Abre la consola del navegador** (F12)
3. **Verificá que NO haya errores** de mixed content
4. **Verificá que las APIs respondan** con datos correctos

Si todo está correcto, deberías ver:
- ✅ La página carga con HTTPS
- ✅ Las API calls van a HTTPS (no HTTP)
- ✅ No hay warnings de mixed content
- ✅ El candado verde en el navegador

## Detalles del Certificado SSL

- **Dominio**: apis-app-dev.nami.com.uy
- **Certificado**: Let's Encrypt
- **Válido hasta**: 2026-06-11
- **Auto-renovación**: Configurada con certbot
- **Puertos abiertos**: 80 (HTTP redirige a HTTPS), 443 (HTTPS), 8000 (Backend directo)

## Arquitectura Final

```
Usuario → Amplify (HTTPS)
           ↓
       Next.js BFF (HTTPS)
           ↓
       nginx (HTTPS) → uvicorn FastAPI (HTTP localhost:8000)
```

## Próximos Pasos

1. ✅ Actualizar variables de entorno en Amplify (API_BASE_URL a HTTPS)
2. ✅ Redeploy en Amplify
3. ✅ Verificar que todo funcione correctamente
4. ⚠️ **Opcional**: Actualizar CORS en el backend si es necesario (agregar variante HTTPS)

## Notas

- El backend internamente sigue usando HTTP en localhost:8000
- Nginx maneja el SSL/TLS y hace proxy a localhost:8000
- Certbot configuró auto-renovación del certificado cada 90 días
- HTTP (puerto 80) redirige automáticamente a HTTPS (puerto 443)
