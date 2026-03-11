# Deploy web-nami a AWS Amplify

Ya tienes tu repositorio en GitHub: `https://github.com/Ignaciort91/web.git`

## Pasos para Deploy

### 1. Commit y Push del archivo amplify.yml

```bash
cd /Users/manuelpanasco/Documents/GitHub/namiuy/ecommerce/web

git add amplify.yml
git commit -m "Add Amplify deployment configuration"
git push origin main
```

### 2. Configurar en AWS Amplify Console

1. **Ir a AWS Amplify**: https://console.aws.amazon.com/amplify/

2. **Nuevo App**:
   - Click en "Host web app"
   - Seleccionar "GitHub"
   - Autorizar AWS Amplify a acceder a GitHub

3. **Seleccionar Repositorio**:
   - Repository: `Ignaciort91/web`
   - Branch: `main` (o la rama que uses)

4. **Configurar Build Settings**:
   - Amplify detectará automáticamente `amplify.yml`
   - App name: `web-nami`
   - Environment: `production`

5. **Variables de Entorno**:
   Click en "Advanced settings" y agregar:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAlOZgc5byJrLQG64CxNn-oKQErr6t8fvE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-6245b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-6245b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-6245b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=994123103016
NEXT_PUBLIC_FIREBASE_APP_ID=1:994123103016:web:34bfc69402b07230ac2e1d

# API Backend (actualizar con tu URL de producción)
NEXT_PUBLIC_API_BASE_URL=http://34.197.48.118:8000
API_BASE_URL=http://34.197.48.118:8000
API_PATH=/api

# S3 Assets
NEXT_PUBLIC_IMAGES_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/products
IMAGES_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/products
NEXT_PUBLIC_BRANDS_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/brands
BRANDS_URL=https://nami-uy.s3.sa-east-1.amazonaws.com/brands

# Application
ID=NAMI
APP_NAME=Nami
BFF_URL=https://main.xxxxx.amplifyapp.com
PRODUCT_COLORS=Blanco,Negro,Azul,Rojo,Verde,Amarillo,Gris,Rosa,Morado,Naranja
PRODUCT_FORM_PHOTO_UPLOAD=true

# Google (opcional)
GOOGLE_MAP_API_KEY=
GOOGLE_GA_MEASUREMENT_ID=
```

6. **Deploy**:
   - Click en "Save and deploy"
   - Espera 5-10 minutos para el primer deploy

### 3. Configurar CORS en el Backend

Una vez que tengas la URL de Amplify (ej: `https://main.d1234abcd.amplifyapp.com`), actualiza el backend:

```python
# En api_ecommerce/backend/app/main.py
origins = [
    "http://localhost:3000",
    "https://main.d1234abcd.amplifyapp.com",  # Tu URL de Amplify
    "https://nami.com.uy",  # Si tienes dominio personalizado
]
```

Reinicia el backend después de este cambio.

### 4. Verificar Deployment

1. Una vez completado el build, obtendrás una URL como:
   `https://main.d1234abcd.amplifyapp.com`

2. Prueba:
   - Login funciona
   - Productos se cargan
   - Cart funciona
   - Checkout funciona

### 5. Dominio Personalizado (Opcional)

Si tienes un dominio como `nami.com.uy`:

1. En Amplify Console > "Domain management"
2. Click "Add domain"
3. Ingresa tu dominio
4. Amplify te dará registros DNS para configurar:
   - Type: CNAME
   - Name: www (o @)
   - Value: xxxxx.cloudfront.net

5. Configura estos registros en tu proveedor de DNS

---

## Arquitectura del Deployment

```
GitHub (Ignaciort91/web)
    ↓ (push to main)
AWS Amplify
    ↓ (build)
1. npm install (monorepo root)
2. Build @namiuy/bff-core
3. Build shared package
4. Build ui package
5. Build web-nami
    ↓ (deploy)
CloudFront CDN → Users
    ↑
Next.js BFF ↔ FastAPI Backend (34.197.48.118:8000)
```

---

## Continuous Deployment

Cada `git push` a la rama `main` activará automáticamente:
1. Build en Amplify
2. Deploy a producción
3. Invalidación de caché

---

## Monitoreo

- **Build logs**: Amplify Console > Build history
- **Metrics**: Amplify Console > Monitoring
- **Errors**: CloudWatch Logs

---

## Troubleshooting

### Build falla en "npm install"
- Verifica que `package.json` en la raíz tenga todas las dependencias
- Revisa los logs de build en Amplify Console

### Error "Module not found" durante build
- Asegúrate de que los packages compartidos se construyan primero
- Verifica el orden en `amplify.yml`

### Páginas devuelven 404
- Verifica que `artifacts.baseDirectory` sea correcto
- Asegúrate de que el build de Next.js se complete exitosamente

### CORS errors en producción
- Actualiza `origins` en el backend FastAPI
- Agrega la URL de Amplify a la lista de orígenes permitidos
- Reinicia el backend

### Variables de entorno no funcionan
- Solo variables con prefijo `NEXT_PUBLIC_` están disponibles en el navegador
- Variables sin prefijo solo están disponibles en el servidor (API routes)
- Reinicia el build después de cambiar variables

---

## Costos Estimados

Para un sitio mediano como web-nami:

- **Build**: ~5-10 min/build × $0.01/min = $0.05-0.10 por build
- **Hosting**: 1-2 GB × $0.15/GB/mes = $0.15-0.30/mes
- **Data transfer**: Primeros 15 GB gratis, luego $0.15/GB

**Total estimado**: $5-15/mes (dentro del free tier al inicio)

**Free Tier** (12 meses):
- 1000 minutos de build/mes
- 15 GB almacenamiento
- 5 GB data transfer/mes
