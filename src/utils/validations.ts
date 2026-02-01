const Patterns = {
  name: /^[A-ZА-Я][a-zA-Zа-яА-Я-]*$/,
  login: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  password: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
  phone: /^\+?\d{10,15}$/,
  message: /.+/,
};

const Messages = {
  name: 'Первая буква заглавная, без пробелов и цифр, нет спецсимволов (кроме дефиса)',
  login: '3-20 символов, латиница, без пробелов, не может состоять только из цифр',
  email: 'Некорректный email',
  password: '8-40 символов, обязательно одна заглавная буква и цифра',
  phone: '10-15 символов, состоит из цифр, может начинаться с плюса',
  message: 'Сообщение не может быть пустым',
};

const ValidationRules: Record<string, { pattern: RegExp; message: string }> = {
  first_name: { pattern: Patterns.name, message: Messages.name },
  second_name: { pattern: Patterns.name, message: Messages.name },
  display_name: { pattern: Patterns.name, message: Messages.name },
  login: { pattern: Patterns.login, message: Messages.login },
  email: { pattern: Patterns.email, message: Messages.email },
  password: { pattern: Patterns.password, message: Messages.password },
  passwordAgain: { pattern: Patterns.password, message: Messages.password },
  oldPassword: { pattern: Patterns.password, message: Messages.password },
  newPassword: { pattern: Patterns.password, message: Messages.password },
  newPasswordAgain: { pattern: Patterns.password, message: Messages.password },
  phone: { pattern: Patterns.phone, message: Messages.phone },
  message: { pattern: Patterns.message, message: Messages.message },
};

export const validateValue = (name: string, value: string): string => {
  const rule = ValidationRules[name];
  if (rule && !rule.pattern.test(value)) {
    return rule.message;
  }
  return '';
};

const getParent = (input: HTMLElement) => {
  return (
    input.closest('.input-sign') ||
    input.closest('.input-profile') ||
    input.closest('.chat__block-message')
  );
};

export const handleFocusOut = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input) return;

  const errorText = validateValue(input.name, input.value);
  const parent = getParent(input);
  if (parent) {
    const errorSpan = parent.querySelector('.error');
    if (errorSpan) {
      errorSpan.textContent = errorText;
    }
  }
};

export const validateForm = (inputs: NodeListOf<HTMLInputElement>): boolean => {
  let isValid = true;
  inputs.forEach((input) => {
    const errorText = validateValue(input.name, input.value);
    if (errorText) {
      isValid = false;
      const parent = getParent(input);
      if (parent) {
        const errorSpan = parent.querySelector('.error');
        if (errorSpan) {
          errorSpan.textContent = errorText;
        }
      }
    }
  });
  return isValid;
};
