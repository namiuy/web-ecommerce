export const addSearchParamsToUrl = (url: string, newParams: Record<string, string | undefined>): string => {
  const baseUrl = new URL(url);
  const newParamsParsed = Object.entries(newParams).filter((p): p is [string, string] => !!p[1]);
  const combinedParams = new URLSearchParams({
    ...Object.fromEntries(baseUrl.searchParams),
    ...Object.fromEntries(newParamsParsed),
  });
  return new URL(`${baseUrl.origin}${baseUrl.pathname}?${combinedParams.toString()}`).href;
};
