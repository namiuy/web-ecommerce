export const validateEmpty = (value: string) => {
  if (!value.toString().length) return 'Este campo es obligatorio';
  return undefined;
};

export const validateEmptySelect = (value: any) => {
  if (!value || value == -1) return 'Debes seleccionar una opción';
  return undefined;
};

export const validateEmail = (value: string) => {
  if (!value.toString().length) return 'Este campo es obligatorio';
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'El correo electrónico no es válido';
  return undefined;
};

export const validatePassword = (value: string) => {
  if (!value.toString().length) return 'Este campo es obligatorio';
  if (value.length < 8 || !/\d/.test(value) || !/[A-Z]/.test(value)) {
    return 'La contraseña debe tener al menos 8 caracteres, un número y una letra mayúscula';
  }
  return undefined;
};

export const validateRepeatPassword = (value: string, password: string) => {
  if (!value.toString().length) return 'Este campo es obligatorio';
  if (value !== password) return 'Las contraseñas no coinciden';
  return undefined;
};
