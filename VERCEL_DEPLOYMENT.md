# Desplegar web-nami a Vercel

## Pasos para desplegar

### 1. Preparar el repositorio

Los archivos de configuración ya están creados:
- `vercel.json` - Configuración de build para monorepo
- `.vercelignore` - Archivos a ignorar en el build
- `apps/web-nami/.env.production` - Variables de entorno de producción

### 2. Acceder a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub

### 3. Importar el proyecto

1. Click en "Add New..." → "Project"
2. Selecciona el repositorio `namiuy/ecommerce`
3. En "Configure Project":
   - **Framework Preset**: Next.js
   - **Root Directory**: `web` (click en "Edit" y selecciona la carpeta `web`)
   - **Build Command**: Déjalo como está (usará el comando de `vercel.json`)
   - **Output Directory**: `apps/web-nami/.next`

### 4. Configurar Variables de Entorno

En la sección "Environment Variables", agrega todas estas variables (una por una):

#### API Configuration
```
NEXT_PUBLIC_API_BASE_URL=http://3.80.25.147:8000
API_BASE_URL=http://3.80.25.147:8000
API_PATH=/api
IMAGES_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/products
BRANDS_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/brands
```

#### Application Configuration
```
ID=TOOLS
APP_NAME=Nami Herramientas
SITE_HOST=https://tu-app.vercel.app
```

#### Product Configuration
```
PRODUCT_CARD_PRICE_TYPE=WITH_TAX
PRODUCT_CARD_CODE=true
PRODUCT_DETAIL_PRICE_TYPE=with_tax
PRODUCT_DETAIL_RELATED_PRODUCTS=true
PRODUCT_DETAIL_STOCK=true
PRODUCT_PAGINATION=true
```

#### Features
```
CART_ENABLED=true
AUTH_ENABLED=true
```

#### Payment Methods
```
PAYMENT_METHODS=SADE,ITDE,ABGI
```

#### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAlOZgc5byJrLQG64CxNn-oKQErr6t8fvE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-6245b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-6245b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-6245b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=994123103016
NEXT_PUBLIC_FIREBASE_APP_ID=1:994123103016:web:34bfc69402b07230ac2e1d
```

**Importante**: Marca todas las variables como disponibles para "Production", "Preview", y "Development"

### 5. Desplegar

1. Click en "Deploy"
2. Espera a que termine el build (puede tardar 3-5 minutos)
3. Una vez terminado, obtendrás una URL como `https://tu-app.vercel.app`

### 6. Actualizar CORS en el Backend

Una vez que tengas la URL de Vercel, necesitas agregar el dominio al CORS del backend:

1. SSH al servidor: `ssh -i api_ecommerce/apis-ecommerce-nami.pem ubuntu@3.80.25.147`
2. Editar el archivo: `nano /home/ubuntu/api_ecommerce/app/main.py`
3. Agregar la URL de Vercel a `allow_origins`:
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:5173",
    "https://main.d1ezr7yw4gys5f.amplifyapp.com",
    "https://tu-app.vercel.app"  # ← Agregar esta línea
],
```
4. Guardar (Ctrl+O, Enter, Ctrl+X)
5. Reiniciar el backend: `sudo systemctl restart api_ecommerce`

### 7. Actualizar SITE_HOST

1. En Vercel, ve a tu proyecto → Settings → Environment Variables
2. Busca `SITE_HOST`
3. Cambia el valor a tu URL real de Vercel (ej: `https://tu-app.vercel.app`)
4. Redeploy el proyecto desde la pestaña "Deployments" → click en los tres puntos → "Redeploy"

## Comandos CLI (Alternativa)

También podés desplegar desde la terminal:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desde la carpeta web/
cd web

# Login a Vercel
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

## Notas Importantes

- **Monorepo**: Vercel detectará automáticamente el monorepo de Turborepo
- **Build Time**: El primer build puede tardar más (5-10 min) porque instala todas las dependencias
- **Builds subsiguientes**: Serán más rápidos gracias al cache de Vercel
- **Dominio personalizado**: Podés configurar un dominio custom en Settings → Domains
- **Variables de entorno**: NUNCA commitees el archivo `.env.production` con credenciales reales

## Troubleshooting

### Error: "Build failed"
- Revisá los logs en Vercel para ver el error específico
- Verificá que todas las variables de entorno estén configuradas
- Asegurate que el Root Directory sea `web`

### Error: "Cannot find module"
- El build command debe ejecutar Turborepo para compilar las dependencias compartidas
- Verificá que `vercel.json` tenga el buildCommand correcto

### Error de CORS al cargar la app
- Agregá la URL de Vercel al backend en `allow_origins`
- Reiniciá el backend después de modificar CORS
