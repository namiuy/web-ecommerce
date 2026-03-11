# Deploy Manual a AWS Amplify

Si tienes problemas conectando GitHub, puedes hacer deploy manual.

## Método 1: AWS Amplify CLI

### Instalación

```bash
npm install -g @aws-amplify/cli
amplify configure
```

Sigue las instrucciones para configurar tus credenciales AWS.

### Deploy

```bash
cd /Users/manuelpanasco/Documents/GitHub/namiuy/ecommerce/web/apps/web-nami

# Inicializar Amplify
amplify init

# Configuración:
# - Project name: web-nami
# - Environment: production
# - Default editor: VSCode
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Distribution directory: .next
# - Build command: npm run build
# - Start command: npm run start

# Agregar hosting
amplify add hosting

# Seleccionar:
# - Hosting with Amplify Console
# - Manual deployment

# Build y deploy
npm run build
amplify publish
```

## Método 2: Exportar y Subir Manualmente

### Build local

```bash
cd /Users/manuelpanasco/Documents/GitHub/namiuy/ecommerce/web

# Instalar dependencias
npm install

# Build packages compartidos
npx turbo run build --filter=@namiuy/bff-core --filter=shared --filter=ui

# Build web-nami
cd apps/web-nami
npm run build

# Exportar como static (opcional)
npm run export  # Si tienes este script configurado
```

### Subir a S3 + CloudFront

```bash
# Instalar AWS CLI si no lo tienes
brew install awscli  # macOS
# o
pip install awscli

# Configurar credenciales
aws configure

# Crear bucket S3
aws s3 mb s3://web-nami-production

# Subir archivos
aws s3 sync .next/static s3://web-nami-production/_next/static --acl public-read
aws s3 sync public s3://web-nami-production/public --acl public-read

# Configurar CloudFront distribution manualmente en AWS Console
```

## Método 3: Usar Vercel (Alternativa Simple)

Vercel es muy fácil y gratuito para proyectos Next.js:

### Con GitHub (recomendado)

1. Ve a: https://vercel.com/new
2. Conecta tu GitHub account
3. Importa el repositorio `Ignaciort91/web`
4. Vercel detectará Next.js automáticamente
5. Configura:
   - **Root Directory**: `apps/web-nami`
   - **Build Command**: `cd ../.. && npm install && npx turbo run build --filter=@namiuy/bff-core --filter=shared --filter=ui && cd apps/web-nami && npm run build`
   - **Output Directory**: `.next`

6. Agrega las variables de entorno (igual que en Amplify)
7. Deploy!

### Con CLI

```bash
npm install -g vercel

cd /Users/manuelpanasco/Documents/GitHub/namiuy/ecommerce/web/apps/web-nami

vercel
# Sigue las instrucciones
```

## Método 4: Railway (Otra Alternativa)

Railway también es muy fácil:

1. Ve a: https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona `Ignaciort91/web`
4. Configura:
   - **Root Directory**: `/apps/web-nami`
   - **Build Command**: Ver arriba
5. Agrega variables de entorno
6. Deploy!

## Recomendación

Si tienes problemas con Amplify + GitHub:

1. **Primero intenta**: Opción 1 o 2 (reinstalar GitHub App o usar Personal Access Token)
2. **Si falla**: Usa **Vercel** - Es gratis, muy fácil, y diseñado específicamente para Next.js
3. **Alternativa**: Railway es también muy bueno y tiene free tier generoso

## Comparación

| Plataforma | Pros | Contras | Costo Free Tier |
|------------|------|---------|-----------------|
| **AWS Amplify** | Integración AWS completa | Setup más complejo | Generoso |
| **Vercel** | Súper fácil, Next.js nativo | Limitado fuera de Next.js | Muy generoso |
| **Railway** | Fácil, flexible | Menos conocido | Generoso |
| **AWS Manual** | Control total | Requiere más conocimiento | Variable |
