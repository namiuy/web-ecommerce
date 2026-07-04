import { ParsedUrlQuery } from 'querystring'

export type AutopartSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  code?: string;
  brandName?: string;
  categoryName?: string;
  modelName?: string;
  pag?: number;
  mode?: string;
  dims?: string;
}

export const getAutopartPropsFromRouter = (query: ParsedUrlQuery): AutopartSearchProps => {
  return {
    brandId: query.b ? Number(query.b) : undefined,
    categoryId: query.c ? String(query.c) : undefined,
    text: query.t ? String(query.t) : undefined,
    code: query.code ? String(query.code) : undefined,
    brandName: query.bn ? String(query.bn) : undefined,
    categoryName: query.cn ? String(query.cn) : undefined,
    modelName: query.mn ? String(query.mn) : undefined,
    pag: query.pag ? Number(query.pag) : undefined,
    mode: query.mode ? String(query.mode) : undefined,
    dims: query.dims ? String(query.dims) : undefined,
  }
}
