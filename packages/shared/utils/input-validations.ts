export const validateEmpty = (value: string) => {
  if (!value.toString().length) return 'El campo no puede estar vacio';
  return undefined;
};

export const validateEmail = (value: string) => {
  if (!value.toString().length) return 'El campo no puede estar vacio';
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'El correo electrónico no es válido';
  return undefined;
};
