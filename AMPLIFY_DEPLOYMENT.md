# Desplegar web-nami a AWS Amplify

## Archivos de configuración

- ✅ `amplify.yml` - Configuración de build para Amplify (ya creado)
- ✅ Todas las variables de entorno necesarias

## Pasos para desplegar

### 1. Acceder a AWS Amplify Console

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Seleccioná la región correcta (probablemente `us-east-1`)
3. Click en **"New app"** → **"Host web app"**

### 2. Conectar el repositorio

1. Seleccioná **GitHub**
2. Autorizá AWS Amplify a acceder a tu cuenta de GitHub
3. Seleccioná el repositorio: **`Ignaciort91/web`**
4. Seleccioná la rama: **`web-tools-api-refactor`**

### 3. Configurar el build

Amplify debería detectar automáticamente el `amplify.yml`. Verificá que:

- **Build command**: `npx turbo run build --filter=@namiuy/bff-core --filter=web-nami`
- **Base directory**: (vacío o `/`)
- **Build output directory**: `apps/web-nami/.next`

### 4. Configurar Variables de Entorno

Hacé click en **"Advanced settings"** y agregá estas variables:

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
SITE_HOST=https://main.xxxxxxxxxx.amplifyapp.com
```
⚠️ Actualizá `SITE_HOST` después del primer deploy con la URL real

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

#### Google Services
```
GOOGLE_MAP_API_KEY=AIzaSyDbvySzv-lSHVtnc4iCNEt-MidCiEkwqI8
GOOGLE_GA_MEASUREMENT_ID=AIzaSyCxeKqoZ3IK-xL08kG4XfzWEgyHy1WIVG8
```

#### Navbar Message (opcional)
```
NAVBAR_MESSAGE=
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

### 5. Configurar Node version (importante)

En **"Advanced settings"** → **"Build image settings"**:

Agregá esta variable:
```
_LIVE_UPDATES=[{"name":"Node.js version","pkg":"node","type":"nvm","version":"18"}]
```

O alternativamente, especificá en el `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 18
        - nvm use 18
        - echo "Installing dependencies..."
        - npm ci
```

### 6. Deploy

1. Click en **"Save and deploy"**
2. Amplify comenzará el build automáticamente
3. El proceso tarda aproximadamente 5-10 minutos

### 7. Monitorear el build

Podés ver los logs en tiempo real:
- **Provision**: Preparación del entorno
- **Build**: Compilación del proyecto
- **Deploy**: Despliegue a CDN
- **Verify**: Verificación final

### 8. Después del primer deploy

1. **Copiá la URL** que te asigna Amplify (ej: `https://main.d1ezr7yw4gys5f.amplifyapp.com`)

2. **Actualizá SITE_HOST**:
   - Ve a **Environment variables**
   - Editá `SITE_HOST` con la URL real
   - Guardá

3. **Redeploy**:
   - Ve a la pestaña principal
   - Click en **"Redeploy this version"**

4. **Actualizar CORS en el backend**:

```bash
ssh -i api_ecommerce/apis-ecommerce-nami.pem ubuntu@3.80.25.147
nano /home/ubuntu/api_ecommerce/app/main.py
```

Agregá la URL de Amplify a `allow_origins`:

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://main.d1ezr7yw4gys5f.amplifyapp.com",  # ← Tu URL de Amplify
],
```

Reiniciá el backend:
```bash
sudo systemctl restart api_ecommerce
```

## Configuración de dominio personalizado (opcional)

Si tenés un dominio:

1. Ve a **Domain management**
2. Click en **"Add domain"**
3. Seguí los pasos para configurar DNS

## Builds automáticos

Amplify automáticamente:
- ✅ Hace build cuando pusheas a la rama configurada
- ✅ Crea previews para Pull Requests
- ✅ Sirve la app desde CDN global de AWS
- ✅ Genera certificados SSL automáticamente

## Troubleshooting

### Error: "Build failed"

1. Revisá los logs en la consola de Amplify
2. Verificá que todas las variables de entorno estén configuradas
3. Asegurate que la versión de Node sea 18

### Error: "Module not found"

- Verificá que `turbo.json` esté en el root
- Verificá que `amplify.yml` tenga el build command correcto

### Error de CORS al cargar la app

- Agregá la URL de Amplify al backend CORS
- Reiniciá el backend

## Ventajas de Amplify

- ✅ Deploy automático en cada push
- ✅ CDN global de AWS (CloudFront)
- ✅ SSL gratis
- ✅ Previews de PRs automáticos
- ✅ Rollback fácil a versiones anteriores
- ✅ Monitoreo integrado
