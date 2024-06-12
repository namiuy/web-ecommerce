export const formatPrice = (price?: number) => {
  if (price || price == 0){
      return price.toFixed(2);
  } 
  return 0;
};
