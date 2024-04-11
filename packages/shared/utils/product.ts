export const formatPrice = (value?: number) => {
  if (value || value == 0) return value.toFixed(2);
  return undefined;
};
