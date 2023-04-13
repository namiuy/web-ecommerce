export const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url);
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};
