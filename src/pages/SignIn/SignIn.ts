import template from './SignIn.hbs?raw';
import './SignIn.scss';
import Block from '../../framework/Block.ts';
import { InputSign } from '../../components/InputSign/InputSign.ts';
import type { SignIn } from '../../type/page.type.ts';
import { Button } from '../../components/Button/Button.ts';
import { ComponentLink } from '../../components/ComponentLink/ComponentLink.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';

class SignInPage extends Block {
  constructor(props: SignIn) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

export const signInPage = new SignInPage({
  title: 'Вход',
  InputLogin: new InputSign({
    type: 'text',
    name: 'login',
    id: 'login',
    label: 'Логин',
    error: '',
    className: 'error',
    events: {
      focusout: handleFocusOut
    }
  }),
  InputPassword: new InputSign({
    type: 'password',
    name: 'password',
    id: 'password',
    label: 'Пароль',
    error: '',
    className: 'error',
    events: {
      focusout: handleFocusOut
    }
  }),
  LinkLogin: new ComponentLink({
    text: 'Нет аккаунта?',
    url: '/signup'
  }),
  ButtonLogin: new Button({
    text: 'Авторизоваться',
    events: {
      click: (e: Event) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('input');
        const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

        if (isValid) {
            const loginInput = document.querySelector('input[name="login"]') as HTMLInputElement;
            const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

            console.log({
            login: loginInput?.value,
            password: passwordInput?.value
            });
        }
      }
    }
  })
});
