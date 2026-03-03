# Firebase Authentication Implementation - Frontend

Este documento detalla la implementación de Firebase Authentication en el frontend de la aplicación e-commerce con un flujo **stateless** (paso de token por request).

## Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Cambios Realizados](#cambios-realizados)
- [Flujos de Autenticación](#flujos-de-autenticación)
- [Configuración](#configuración)
- [Testing](#testing)

---

## Arquitectura

### Flujo Stateless (Opción A)

```
Frontend (Firebase Auth) → Obtiene ID Token → Envía a BFF en cada request → BFF valida/proxy → FastAPI valida
```

### Ventajas

✅ **Sin problemas de concurrencia**: Cada request lleva su propio token
✅ **Escalable**: No depende de almacenamiento de sesiones en el servidor
✅ **Simple**: El BFF actúa como simple proxy
✅ **Seguro**: Firebase maneja toda la autenticación
✅ **Token en cada request**: Flujo completamente stateless

---

## Cambios Realizados

### 1. Instalación de Dependencias

**Archivo**: `/packages/shared/package.json`

```json
{
  "dependencies": {
    "firebase": "^10.14.1",
    "lscache": "^1.3.2",
    "react": "^18.2.0",
    "swr": "^2.1.0"
  }
}
```

**Comando ejecutado**:
```bash
cd /Users/manuelpanasco/Documents/GitHub/ecommerce/web/packages/shared
npm install firebase@^10.12.0
```

---

### 2. Servicio de Firebase

**Archivo creado**: `/packages/shared/services/firebase.ts`

Este archivo contiene todas las funciones para interactuar con Firebase Authentication:

```typescript
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';

// Funciones principales:
// - initializeFirebase(): Inicializa Firebase con variables de entorno
// - firebaseSignIn(email, password): Login con Firebase
// - firebaseSignUp(email, password): Registro con Firebase
// - firebaseSignOut(): Cerrar sesión
// - getCurrentUserToken(): Obtener token del usuario actual
// - refreshUserToken(): Refrescar token (automático cada 1 hora)
```

**Características**:
- Inicialización automática en el cliente
- Singleton pattern para la instancia de Firebase
- Manejo de errores
- Token refresh automático
- Exporta todas las funciones necesarias

---

### 3. Variables de Entorno

**Archivo**: `/apps/web-nami/.env.local`

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAlOZgc5byJrLQG64CxNn-oKQErr6t8fvE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-6245b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-6245b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-6245b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=994123103016
NEXT_PUBLIC_FIREBASE_APP_ID=1:994123103016:web:34bfc69402b07230ac2e1d
```

**Nota**: Usar el prefijo `NEXT_PUBLIC_` hace que las variables estén disponibles en el cliente (browser).

---

### 4. Actualización del Fetcher

**Archivo**: `/packages/shared/utils/fetcher.ts`

**Cambio principal**: Reemplazar `access_token` con `firebase_token`

**Antes**:
```typescript
const getRequestInit = (
  method: Method,
  init: RequestInit = {} as RequestInit,
  withAuth: boolean = false,
): RequestInit | undefined => {
  const withContent = method === 'POST' || method === 'PUT' || method === 'DELETE';
  return {
    method,
    headers: {
      ...(withContent ? { 'Content-Type': 'application/json' } : {}),
      ...(withAuth && lscache.get('access_token')
        ? { Authorization: `Bearer ${lscache.get('access_token')?.access_token}` }
        : {}),
    },
    ...init,
  };
};
```

**Después**:
```typescript
const getRequestInit = (
  method: Method,
  init: RequestInit = {} as RequestInit,
  withAuth: boolean = false,
): RequestInit | undefined => {
  const withContent = method === 'POST' || method === 'PUT' || method === 'DELETE';

  // Get Firebase ID token from localStorage
  const firebaseToken = lscache.get('firebase_token');

  return {
    method,
    headers: {
      ...(withContent ? { 'Content-Type': 'application/json' } : {}),
      ...(withAuth && firebaseToken
        ? { Authorization: `Bearer ${firebaseToken}` }
        : {}),
    },
    ...init,
  };
};
```

**También actualizado en `postFormData()`**:
```typescript
export const postFormData = async <T>(url: string, formData: FormData, withAuth?: boolean): Promise<T> => {
  // Get Firebase ID token from localStorage
  const firebaseToken = lscache.get('firebase_token');

  const headers: HeadersInit = {
    ...(withAuth && firebaseToken
      ? { Authorization: `Bearer ${firebaseToken}` }
      : {}),
  };
  // ... resto del código
};
```

---

### 5. Hooks de Usuario Actualizados

**Archivo**: `/packages/shared/hooks/request/user.ts`

#### 5.1. Imports actualizados

```typescript
import { firebaseSignIn, firebaseSignUp } from '../../services/firebase';
```

#### 5.2. Hook `useSignIn` - Login con Firebase

**Antes**: Llamaba a `/oauth/access_token` del BFF

**Después**:
```typescript
export const useSignIn = (props?: SignInProps): Result<User> => {
  const [firebaseUid, setFirebaseUid] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        if (props) {
          setIsLoading(true);
          try {
            // Step 1: Sign in with Firebase
            const { user: firebaseUser, token } = await firebaseSignIn(props.email, props.password);

            // Step 2: Store Firebase token in localStorage
            lscache.set('firebase_token', token);

            // Step 3: Store Firebase UID to fetch user from BFF
            setFirebaseUid(firebaseUser.uid);
          } catch (err: any) {
            console.error('Firebase sign in error:', err);
            setError(err.message || 'Error al iniciar sesión');
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }
  }, [props]);

  useEffect(() => {
    if (firebaseUid) {
      const fetchData = async () => {
        try {
          // Step 4: Fetch user profile from BFF using Firebase UID
          const result = await getUser(firebaseUid);

          if (result.error) {
            setError(result.error);
          } else {
            lscache.set('user', result);
            setUser(result);
          }
        } catch (err: any) {
          console.error('Get user error:', err);
          setError(err.message || 'Error al obtener datos del usuario');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [firebaseUid]);

  return { isLoading, data: user, error };
};
```

**Flujo**:
1. Usuario ingresa credenciales
2. `firebaseSignIn()` autentica con Firebase
3. Guarda token de Firebase en localStorage
4. Usa Firebase UID para buscar perfil en BFF
5. Guarda datos de usuario en localStorage

#### 5.3. Hook `useAddUser` - Registro con Firebase

**Antes**: Creaba usuario directamente en el BFF

**Después**:
```typescript
export const useAddUser = (props?: UserAdd): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Step 1: Create user in Firebase
          const { user: firebaseUser, token } = await firebaseSignUp(props.email, props.password);

          // Step 2: Store Firebase token temporarily
          lscache.set('firebase_token', token);

          // Step 3: Create user profile in BFF/FastAPI with Firebase UID
          const userDataForBFF = {
            ...props,
            uid: firebaseUser.uid, // Send Firebase UID to BFF
          };

          const result = await addUser(userDataForBFF);

          if (result.error) {
            setError(result.error);
            setData(false);
          } else {
            setData(true);
          }
        } catch (err: any) {
          console.error('Firebase sign up error:', err);
          setError(err.message || 'Error al crear la cuenta');
          setData(false);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [props]);

  return { isLoading, data, error };
};
```

**Flujo**:
1. Usuario ingresa datos de registro
2. `firebaseSignUp()` crea usuario en Firebase
3. Guarda token de Firebase en localStorage
4. Envía datos + Firebase UID al BFF para crear perfil
5. BFF sincroniza con FastAPI

---

### 6. Componente MenuAdmin - Logout Actualizado

**Archivo**: `/packages/ui/components/MenuAdmin.tsx`

#### 6.1. Import agregado

```typescript
import { firebaseSignOut } from 'shared/services/firebase';
```

#### 6.2. Función `handleSignOut` actualizada

**Antes**:
```typescript
const handleSignOut = () => {
  lscache.remove('access_token');
  lscache.remove('user');
  router.reload();
};
```

**Después**:
```typescript
const handleSignOut = async () => {
  try {
    // Sign out from Firebase
    await firebaseSignOut();

    // Remove tokens and user data from localStorage
    lscache.remove('firebase_token');
    lscache.remove('user');

    // Reload the page to reset state
    router.reload();
  } catch (error) {
    console.error('Error signing out:', error);
    // Even if Firebase signout fails, clear local data
    lscache.remove('firebase_token');
    lscache.remove('user');
    router.reload();
  }
};
```

**Flujo**:
1. Llama a `firebaseSignOut()` para cerrar sesión en Firebase
2. Limpia `firebase_token` y `user` de localStorage
3. Recarga la página para resetear el estado
4. Si falla el signout de Firebase, igual limpia los datos locales

---

## Flujos de Autenticación

### Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuario ingresa email/password en /iniciar                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Frontend llama firebaseSignIn(email, password)              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Firebase Authentication valida credenciales                 │
│    Retorna: { user: { uid: "..." }, token: "eyJhbG..." }      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Frontend guarda en localStorage:                            │
│    - lscache.set('firebase_token', token)                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Frontend → BFF: GET /users/{firebase_uid}                   │
│    Headers: { Authorization: "Bearer {firebase_token}" }       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BFF → FastAPI: POST /api/auth/me                            │
│    Headers: { authorization: "{firebase_token}" }              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. FastAPI valida token con Firebase Admin SDK                 │
│    Retorna: { user_id, email, username, full_name, ... }      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. BFF transforma datos y retorna al Frontend                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. Frontend guarda usuario:                                     │
│    - lscache.set('user', userData)                             │
│    - Redirige a homepage o dashboard                           │
└─────────────────────────────────────────────────────────────────┘
```

### Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuario ingresa datos en /registro                          │
│    (email, password, nombre, apellido, etc.)                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Frontend llama firebaseSignUp(email, password)              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Firebase crea usuario y retorna:                            │
│    { user: { uid: "new-uid..." }, token: "eyJhbG..." }        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Frontend guarda token:                                       │
│    - lscache.set('firebase_token', token)                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Frontend → BFF: POST /users                                 │
│    Body: { ...userData, uid: firebase_uid }                    │
│    Headers: { Authorization: "Bearer {firebase_token}" }       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BFF → FastAPI: POST /api/users                              │
│    Valida token y crea perfil con Firebase UID                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Registro completado → Usuario puede iniciar sesión          │
└─────────────────────────────────────────────────────────────────┘
```

### Authenticated Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuario hace cualquier acción (ver perfil, agregar carrito) │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Frontend llama API con withAuth: true                       │
│    Ej: get('/users/me', {}, true)                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Fetcher lee token de localStorage:                          │
│    const token = lscache.get('firebase_token')                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Fetcher agrega header:                                       │
│    Authorization: "Bearer {firebase_token}"                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. BFF recibe request con token en header                      │
│    withAuth middleware extrae token                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BFF → FastAPI con mismo token                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. FastAPI valida token y procesa request                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Respuesta retorna al Frontend                               │
└─────────────────────────────────────────────────────────────────┘
```

### Logout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuario hace clic en "Cerrar sesión"                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. handleSignOut() llama firebaseSignOut()                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Firebase invalida la sesión del usuario                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Frontend limpia localStorage:                               │
│    - lscache.remove('firebase_token')                          │
│    - lscache.remove('user')                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Recarga la página → Usuario vuelve a estado no autenticado  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuración

### URLs de Desarrollo

- **Frontend**: http://localhost:3008 (web-nami)
- **BFF**: http://localhost:3001
- **FastAPI**: http://localhost:8000

### localStorage Keys

El frontend usa las siguientes keys en localStorage:

| Key | Descripción | Ejemplo |
|-----|-------------|---------|
| `firebase_token` | Token JWT de Firebase | `"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg..."` |
| `user` | Datos del perfil de usuario | `{ id: "uid123", email: "user@example.com", ... }` |

### Token Expiration

- **Firebase ID Tokens**: Expiran después de **1 hora**
- **Refresh automático**: Firebase SDK refresca el token automáticamente antes de expirar
- **Función manual**: `refreshUserToken()` disponible en `firebase.ts`

---

## Testing

### Testing Manual

#### 1. Test de Login

1. Abrir http://localhost:3008/iniciar
2. Ingresar credenciales de un usuario existente en Firebase
3. Click en "Iniciar sesión"
4. Verificar:
   - ✅ Redirección a homepage
   - ✅ Nombre de usuario aparece en la barra superior
   - ✅ localStorage contiene `firebase_token` y `user`
5. Verificar en consola del navegador:
   ```
   Firebase initialized successfully
   ```

#### 2. Test de Registro

1. Abrir http://localhost:3008/registro
2. Ingresar datos de nuevo usuario
3. Click en "Registrarse"
4. Verificar:
   - ✅ Usuario creado en Firebase Console
   - ✅ Perfil creado en FastAPI (verificar base de datos)
   - ✅ Mensaje de éxito en frontend

#### 3. Test de Request Autenticado

1. Login como usuario
2. Ir a http://localhost:3008/perfil
3. Verificar:
   - ✅ Datos de perfil se cargan correctamente
   - ✅ En DevTools Network tab, request tiene header `Authorization: Bearer ...`

#### 4. Test de Logout

1. Usuario logueado
2. Click en nombre de usuario → "Cerrar sesión"
3. Verificar:
   - ✅ Redirección a página de inicio sin autenticar
   - ✅ localStorage vacío (sin `firebase_token` ni `user`)
   - ✅ Botón "Iniciar sesión" visible

#### 5. Test de Token Refresh

1. Usuario logueado
2. Esperar más de 1 hora (o forzar token expirado en Firebase Console)
3. Hacer cualquier request autenticado
4. Verificar:
   - ✅ Firebase refresca el token automáticamente
   - ✅ Request se completa exitosamente

### Testing de Errores

#### Error: Credenciales Incorrectas

1. Ir a /iniciar
2. Ingresar email/password inválidos
3. Verificar:
   - ✅ Mensaje de error: "Error al iniciar sesión"
   - ✅ No se guarda nada en localStorage
   - ✅ Usuario permanece en página de login

#### Error: Usuario No Existe en BFF

1. Crear usuario en Firebase Console manualmente
2. Intentar login con ese usuario
3. Verificar:
   - ✅ Login en Firebase exitoso
   - ✅ Error al buscar perfil: "Usuario no encontrado"
   - ✅ Token guardado pero usuario no autenticado completamente

#### Error: Token Inválido

1. Modificar manualmente `firebase_token` en localStorage
2. Intentar hacer request autenticado
3. Verificar:
   - ✅ FastAPI retorna 401 Unauthorized
   - ✅ Frontend muestra error apropiado

---

## Troubleshooting

### Firebase no inicializa

**Síntoma**: Error en consola: "Firebase configuration is missing"

**Solución**:
1. Verificar que `.env.local` tiene todas las variables `NEXT_PUBLIC_FIREBASE_*`
2. Reiniciar el servidor de desarrollo: `npm run dev`
3. Limpiar cache de Next.js: `rm -rf .next`

### Token no se envía en requests

**Síntoma**: Requests fallan con 401 Unauthorized

**Solución**:
1. Verificar que `withAuth: true` está en el tercer parámetro del fetch
2. Verificar localStorage tiene `firebase_token`
3. Verificar en DevTools Network que el header `Authorization` está presente

### Usuario no se encuentra después de login

**Síntoma**: Login exitoso en Firebase pero error al cargar perfil

**Solución**:
1. Verificar que el usuario existe en la base de datos de FastAPI
2. Verificar que el `user_id` en FastAPI coincide con el Firebase UID
3. Ver logs de FastAPI para errores de validación

### CORS Errors

**Síntoma**: Error de CORS al hacer requests al BFF

**Solución**:
1. Verificar que BFF permite el origen del frontend en CORS config
2. Verificar que BFF está corriendo en el puerto correcto (3001)

---

## Próximos Pasos / TODOs

- [ ] Implementar password reset flow (restorePwd1, restorePwd2)
- [ ] Implementar email verification (activate)
- [ ] Implementar change password (changePwd)
- [ ] Agregar manejo de errores más detallado
- [ ] Implementar token refresh listener global
- [ ] Agregar tests automatizados (unit + integration)
- [ ] Implementar logout en todos los componentes que lo necesiten
- [ ] Documentar endpoints del BFF actualizados

---

## Resumen de Archivos Modificados

### Archivos Creados
- ✨ `/packages/shared/services/firebase.ts` - Servicio de Firebase

### Archivos Modificados
- 📝 `/packages/shared/package.json` - Agregado `firebase` dependency
- 📝 `/apps/web-nami/.env.local` - Agregadas variables Firebase
- 📝 `/packages/shared/utils/fetcher.ts` - Cambiado a `firebase_token`
- 📝 `/packages/shared/hooks/request/user.ts` - Hooks de login/registro con Firebase
- 📝 `/packages/ui/components/MenuAdmin.tsx` - Logout con Firebase

### Total de Cambios
- **5 archivos modificados**
- **1 archivo creado**
- **~200 líneas de código agregadas**
- **~50 líneas de código eliminadas**

---

## Referencias

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [LocalStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Documento creado**: 2026-02-05
**Última actualización**: 2026-02-05
**Versión**: 1.0.0
