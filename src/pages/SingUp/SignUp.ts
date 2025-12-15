import template from './SignUp.hbs?raw';
import './SignUp.scss';
import Block from '../../framework/Block.ts'
import { InputSign } from '../../components/InputSign/InputSign.ts'
import type { SignUp } from '../../type/page.type.ts'
import { Button } from '../../components/Button/Button.ts'
import { ComponentLink } from '../../components/ComponentLink/ComponentLink.ts'
import { handleFocusOut, validateForm } from '../../utils/validations.ts';

class SignUpPage extends Block {
  constructor(props: SignUp) {
      super('main', props);
  }

    render() {
      return this.compile(template, this.props);
    }
  }

export const signUpPage = new SignUpPage({
  title: 'Регистрация',
  InputEmail: new InputSign({
    type: 'text',
    name: 'email',
    id: 'email',
    label: 'Почта',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  InputLogin: new InputSign({
    type: 'text',
    name: 'login',
    id: 'login',
    label: 'Логин',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  InputFirstName: new InputSign({
    type: 'text',
    name: 'first_name',
    id: 'first_name',
    label: 'Имя',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  InputSecondName: new InputSign({
    type: 'text',
    name: 'second_name',
    id: 'second_name',
    label: 'Фамилия',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  InputPhone: new InputSign({
    type: 'text',
    name: 'phone',
    id: 'phone',
    label: 'Телефон',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  InputPassword: new InputSign({
    type: 'password',
    name: 'password',
    id: 'password',
    label: 'Пароль',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  InputPasswordAgain: new InputSign({
    type: 'password',
    name: 'passwordAgain',
    id: 'passwordAgain',
    label: 'Пароль (еще раз)',
    error: '',
    className: 'error',
    events: { focusout: handleFocusOut }
  }),
  ButtonRegister: new Button({
    text: 'Зарегистрироваться',
    events: {
      click: (e: Event) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('input');
        const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

        if (isValid) {
            const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
            const loginInput = document.querySelector('input[name="login"]') as HTMLInputElement;
            const firstNameInput = document.querySelector('input[name="first_name"]') as HTMLInputElement;
            const secondNameInput = document.querySelector('input[name="second_name"]') as HTMLInputElement;
            const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
            const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
            const passwordAgainInput = document.querySelector('input[name="passwordAgain"]') as HTMLInputElement;

            console.log({
            email: emailInput?.value,
            login: loginInput?.value,
            first_name: firstNameInput?.value,
            last_name: secondNameInput?.value,
            phone: phoneInput?.value,
            password: passwordInput?.value,
            passwordAgain: passwordAgainInput?.value
            });
        }
      }
    }
  }),
  LinkRegister: new ComponentLink({
    text: 'Войти',
    url: '/signin'
  })
});
