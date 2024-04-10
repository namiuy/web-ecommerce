export const formatPrice = (value?: number) => {
  if (value) return value.toFixed(2);
  return undefined;
};
