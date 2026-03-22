# API Refactor Fase 5 — Cleanup código viejo

## Contexto
Se migró toda la API de Pages Router (`pages/api/`) a App Router (`app/api/`).
- **38 archivos nuevos** en `apps/web-nami/`: `lib/` (foundation) + `lib/services/` (11 services) + `app/api/` (22 endpoints)
- **Todo funcional**: los nuevos route handlers reemplazan 1:1 los viejos
- El frontend (`packages/shared/hooks/request/*`) no cambió — las URLs son idénticas
- **Referencia completa**: `apps/web-nami/API-REFACTOR-STATUS.md`

## Qué hacer

### 1. Eliminar `apps/web-nami/pages/api/`
- Todo el directorio. Los 22 nuevos route handlers en `app/api/` ya reemplazan cada endpoint.
- Verificar antes: que no haya ningún endpoint en pages/api/ que NO tenga equivalente en app/api/.

### 2. Eliminar `apps/web-nami/repositories/`
- Los ~10 repos estilo FastAPI. Reemplazados por `lib/services/` + `lib/api-client.ts`.
- Buscar imports: `grep -r "repositories/" apps/web-nami/` para asegurar que pages/ era el único consumer.

### 3. Eliminar `apps/web-nami/usecases/`
- Use cases pass-through (banner, brand, cart, category, city, order, person, product, state, stock).
- Verificar que ningún componente del frontend los importa.

### 4. Simplificar `packages/bff-core`
- Eliminar `repositories/` (interfaces IXxxRepository + StockRepository implementation)
- Eliminar `types/` (Result<T>, createSuccessResult, createErrorResult)
- **Dejar `entities/`** — el frontend puede importar Brand, Product, Cart, etc.
- Verificar imports: `grep -rn "@namiuy/bff-core" packages/ apps/` para ver qué se usa todavía.

### 5. Verificar imports
- Buscar en todo el repo imports de: `usecases/`, `repositories/`, `_config`, `_helpers`
- Si hay imports en componentes/pages del frontend → NO borrar esos archivos, documentar qué queda

### 6. NO hacer
- NO modificar `app/api/` ni `lib/services/` (ya están bien)
- NO tocar el frontend (pages de UI, components, hooks)
- NO hacer npm install, build, commit ni push
- NO borrar `API-REFACTOR-STATUS.md` — actualizar la sección Fase 5 como completada

## Archivos de referencia
- `apps/web-nami/API-REFACTOR-STATUS.md` — estado completo del refactor
- `packages/shared/hooks/request/*` — contrato de URLs del frontend
- `packages/shared/utils/fetcher.ts` — cómo el frontend inyecta auth token
- `apps/web-nami/next.config.js` — basePath y config (no tocar)

## Entregable
- Actualizar `API-REFACTOR-STATUS.md` con el resultado de Fase 5
- Listar qué se borró y qué se dejó (y por qué)
