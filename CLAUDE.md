# Web Monorepo

Monorepo de frontends Next.js para el ecosistema Nami/Robotec.

## Stack

- **Next.js 13.5** / **React 18** / **Chakra UI** / **TypeScript**
- **Monorepo**: npm workspaces + turbo (turbo solo para lint, NO para build)
- **Deploy**: AWS Amplify (SSR)

## Estructura

```
web/
├── apps/
│   ├── web-nami/           # E-commerce herramientas (usa api_ecommerce)
│   ├── web-autoparts/      # E-commerce autopartes (usa api_autoparts + api_ecommerce)
│   └── web-control-panel/  # Panel de control
├── packages/
│   ├── shared/             # Hooks, entidades, utils, context
│   └── ui/                 # Componentes Chakra UI (ProductCard, NavBar, Footer, etc.)
├── turbo.json              # Env vars declaradas (solo para ESLint rule)
├── amplify.yml             # Build config para Amplify
└── package.json            # Workspaces root
```

## Levantar

```bash
cd web
npm install              # instala todo el monorepo
cd apps/web-autoparts
npm run dev              # levanta en localhost:3000
```

## Patrones clave

- **Pages Router**: Todas las apps usan `pages/` para páginas y `pages/api/` para API routes
- **NO App Router**: No usar `app/` sin `layout.tsx` — las rutas no funcionan
- **API routes como mappers**: `pages/api/` transforma datos del backend al formato que esperan los componentes de `packages/ui` (Product, Category, Stock)
- **Llamadas directas al backend**: Para operaciones lentas (search/smart), el browser llama directo al backend (CORS * habilitado)
- **Config via publicRuntimeConfig**: Variables de negocio (envId, menuItems, product config) se pasan via `next.config.js` publicRuntimeConfig

## Amplify deploy

- Solo env vars con `NEXT_PUBLIC_` llegan al runtime SSR
- `amplify.yml` define build commands por app (appRoot)
- Build: `cd $CODEBUILD_SRC_DIR/web-ecommerce && npm ci && cd apps/{app} && npm run build`
- El repo se clona como `web-ecommerce` (nombre del repo en GitHub)

## Packages compartidos

- `packages/shared`: hooks (`useRequest`, `useAutopartSearch`, `useProductSearch`), entidades (`Product`, `Autopart`, `Category`), env config (`getEnvId`, `getProduct`)
- `packages/ui`: `ProductCard`/`AutopartCard`, `NavBar`, `Footer`, `ProductStock`, `SearchInput`, `ThemeProvider`
