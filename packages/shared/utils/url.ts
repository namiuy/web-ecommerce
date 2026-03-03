import { ProductSearchSortBy } from '../entities/product-search';

export const addSearchParamsToUrl = (url: string, newParams: Record<string, string | undefined>): string => {
  // Handle relative URLs by creating a temporary absolute URL
  const isRelative = url.startsWith('/');
  const baseUrl = isRelative
    ? new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    : new URL(url);

  const newParamsParsed = Object.entries(newParams).filter((p): p is [string, string] => !!p[1]);
  const combinedParams = new URLSearchParams({
    ...Object.fromEntries(baseUrl.searchParams),
    ...Object.fromEntries(newParamsParsed),
  });

  // Return relative URL if input was relative
  if (isRelative) {
    return `${baseUrl.pathname}?${combinedParams.toString()}`;
  }

  return new URL(`${baseUrl.origin}${baseUrl.pathname}?${combinedParams.toString()}`).href;
};

export const removeSearchParamFromUrl = (url: string, key: string): string => {
  const baseUrl = new URL(url);
  let currentParams = Object.fromEntries(baseUrl.searchParams);
  delete currentParams[key];
  const params = new URLSearchParams(currentParams);
  return new URL(`${baseUrl.origin}${baseUrl.pathname}?${params.toString()}`).href;
};

export const getProductsUrl = (props?: { clearSearch?: boolean }) =>
  `${window.location.protocol}//${window.location.host}/productos${props?.clearSearch ? '' : window.location.search}`;

export const getProductPropsFromRouter = (query: Record<string, unknown>) => {
  const b = query?.b;
  const pag = query?.pag;

  return {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: query?.c?.toString(),
    text: query?.t?.toString(),
    sortBy: query?.s?.toString() as ProductSearchSortBy,
    pag: typeof pag === 'string' ? Number(pag) : undefined,
  };
};
