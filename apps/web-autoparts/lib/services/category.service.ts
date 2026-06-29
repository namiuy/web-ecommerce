import { apiFetch } from '../api-client'
import { config } from '../config'
import type { Category } from 'shared/entities/category'

const BASE = config.autopartsApiBaseUrl

type TipoBase = {
  IdTipoBase: number
  Nombre: string
  Activo: boolean
  Hijos: boolean | null
}

type TipoProducto = {
  IdTipoProducto: number
  Nombre: string
  TipoBase: number
  Activo: boolean
}

/**
 * Lists tipos base from api_autoparts as Category objects.
 * Uses /api/tipos-base which returns the 14 main categories.
 * Categories with Hijos=true have subcategories loaded via getSubCategories.
 */
export async function listCategories(): Promise<Category[]> {
  const response = await apiFetch<{ tipos_base: TipoBase[] }>('/api/tipos-base', {
    baseUrl: BASE,
  })
  const tiposBase = response.tipos_base || response

  // For each tipo base with Hijos=true, load subcategories
  const categories: Category[] = await Promise.all(
    tiposBase
      .filter((tb) => tb.Activo)
      .map(async (tb) => {
        let sub_categories: Category[] | undefined

        if (tb.Hijos) {
          try {
            const subResponse = await apiFetch<{ tipos: TipoProducto[] }>(
              `/api/tipos-producto/por-tipo-base/${tb.IdTipoBase}`,
              { baseUrl: BASE },
            )
            const tipos = subResponse.tipos || subResponse
            // Deduplicate by name
            const seen = new Set<string>()
            sub_categories = (tipos as TipoProducto[])
              .filter((tp) => {
                if (!tp.Activo) return false
                const key = tp.Nombre.trim()
                if (seen.has(key)) return false
                seen.add(key)
                return true
              })
              .map((tp) => ({
                id: tp.Nombre,
                name: tp.Nombre.trim(),
                path: '',
                image_url: '',
                is_sub_category: true,
              }))
          } catch {
            sub_categories = undefined
          }
        }

        return {
          id: tb.Nombre,
          name: tb.Nombre.trim(),
          path: '',
          image_url: '',
          is_sub_category: false,
          sub_categories,
        }
      }),
  )

  return categories.sort((a, b) => a.name.localeCompare(b.name))
}
