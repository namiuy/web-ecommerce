# Nami E-commerce Frontend - Estado del Proyecto

## Última actualización: 2026-03-04

## Descripción General
Frontend del e-commerce Nami, desarrollado con Next.js y Material-UI, actuando como BFF (Backend for Frontend) para la integración con Firebase Auth y el backend FastAPI.

## Stack Tecnológico
- **Framework**: Next.js (Pages Router)
- **UI Library**: Material-UI
- **Autenticación**: Firebase Authentication
- **State Management**: Probablemente Redux (verificar en context.ts)
- **Backend API**: FastAPI (ubicado en `api_ecommerce/backend`)

## Estructura del Proyecto

```
web-nami/
├── pages/              # Páginas Next.js (routing)
├── components/         # Componentes React reutilizables
├── usecases/          # Lógica de negocio (casos de uso)
├── repositories/      # Capa de acceso a datos (llamadas API)
├── theme/             # Configuración de Material-UI theme
├── public/            # Archivos estáticos
├── .env.local         # Variables de entorno (Firebase, API URLs)
├── next.config.js     # Configuración de Next.js
└── package.json       # Dependencias npm
```

## Integración con Backend

### Flujo de Autenticación (Firebase)
1. **Registro/Login**:
   - El usuario se registra/loguea con Firebase en el frontend
   - El frontend obtiene el token de Firebase
   - El frontend llama a `POST /api/auth/sync-user` del backend para sincronizar el usuario
   - El backend crea/actualiza el usuario en SQL Server
   - **El backend envía automáticamente un email de bienvenida** ✅

2. **Requests autenticados**:
   - Cada request al backend incluye el token de Firebase en el header `Authorization: Bearer {token}`
   - El backend valida el token con Firebase Admin SDK
   - El backend obtiene la info del usuario desde SQL Server

### Endpoints del Backend (FastAPI)
Ver documentación completa en `api_ecommerce/backend/PROJECT_STATE.md`

Principales endpoints:
- `POST /api/auth/sync-user` - Sincronizar usuario de Firebase a DB
- `GET /api/auth/me` - Obtener info del usuario actual
- `GET /api/products` - Listar productos
- `POST /api/cart` - Gestionar carrito
- `POST /api/orders` - Crear orden

## Variables de Entorno (.env.local)

El archivo `.env.local` debería contener:
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... otras variables de Firebase

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
# o en producción:
# NEXT_PUBLIC_API_URL=https://api.nami.com
```

## Funcionalidades Implementadas

### ✅ Autenticación
- Login con Firebase
- Registro con Firebase
- Sincronización automática con backend
- Email de bienvenida al registrarse (manejado por backend)

### ✅ Productos
- Listado de productos
- Filtros y búsqueda
- Detalle de producto

### ✅ Carrito de Compras
- Agregar productos
- Actualizar cantidades
- Eliminar items
- Ver total

### ✅ Órdenes
- Crear orden desde carrito
- Ver historial de órdenes
- Ver detalle de orden

## Arquitectura de Capas

### 1. Pages (Routing)
Maneja las rutas de Next.js y renderizado de páginas

### 2. Components
Componentes React reutilizables (botones, cards, forms, etc.)

### 3. UseCases
Lógica de negocio y reglas del dominio
Ejemplo: `validateCart()`, `processCheckout()`

### 4. Repositories
Capa de acceso a datos - llamadas HTTP al backend
Ejemplo: `authRepository.syncUser()`, `productRepository.getAll()`

## Integración con Firebase

### Configuración Firebase
Las credenciales están en `.env.local` (no commitear)

### Funciones principales:
- `signInWithEmailAndPassword()` - Login
- `createUserWithEmailAndPassword()` - Registro
- `signOut()` - Logout
- `onAuthStateChanged()` - Listener de cambios de auth

## Notas Importantes

1. **Next.js Pages Router**: Este proyecto usa Pages Router (no App Router)

2. **BFF Pattern**: El frontend actúa como Backend for Frontend:
   - Maneja Firebase Auth
   - Sincroniza usuarios con el backend
   - Envía tokens a cada request

3. **Material-UI**: Configuración de theme en carpeta `theme/`

4. **Environment Variables**: Todas las variables de entorno deben tener prefijo `NEXT_PUBLIC_` para estar disponibles en el cliente

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## TODO / Próximas Funcionalidades

- [ ] Mejorar manejo de errores en llamadas API
- [ ] Agregar loading states
- [ ] Implementar recuperación de contraseña
- [ ] Agregar tests (Jest + React Testing Library)
- [ ] Optimizar imágenes con Next.js Image
- [ ] Agregar SEO metadata
- [ ] Implementar Analytics (Google Analytics / Firebase Analytics)

## Relación con Backend

Este frontend se comunica con:
- **Backend FastAPI**: `api_ecommerce/backend/`
  - Ver: `api_ecommerce/backend/PROJECT_STATE.md`
  - Ver: `api_ecommerce/backend/EMAIL_SETUP.md`

## Para Futuras Sesiones

**Cuando vuelvas a trabajar en el frontend:**

1. Ejecutá `/init` para cargar el contexto completo
2. O manualmente: "Lee PROJECT_STATE.md del frontend y backend"
3. Revisá `.env.local` para verificar configuración
4. Verificá que el backend esté corriendo en `http://localhost:8000`

---

**Para verificar que todo funciona:**
```bash
# Terminal 1: Backend
cd api_ecommerce/backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd web/apps/web-nami
npm run dev
```

Luego abrí: http://localhost:3000

---

**Autor**: Claude Code
**Fecha**: 2026-03-04
**Estado**: En desarrollo activo
