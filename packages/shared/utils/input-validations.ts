export const validateEmpty = (value: string) => {
  return !value.toString().length ? 'El campo no puede estar vacio' : undefined;
};
