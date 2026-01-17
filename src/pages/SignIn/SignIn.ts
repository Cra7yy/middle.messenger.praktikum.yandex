import template from './SignIn.hbs?raw';
import './SignIn.scss';
import Block from '../../framework/Block.ts';
import { InputSign } from '../../components/InputSign/InputSign.ts';
import { Button } from '../../components/Button/Button.ts';
import { ComponentLink } from '../../components/ComponentLink/ComponentLink.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';
import { ROUTES } from '../../const/paths.ts'
import AuthController from '../../controllers/UserController.ts'
import Router from '../../utils/router.ts'

const router = new Router("#app");

export class SignInPage extends Block {
  constructor() {
    super('main', {
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
        className: 'component-link',
        events: {
          click: (): void => {
            router.go(ROUTES.REGISTER);
          }
        }
      }),
      ButtonLogin: new Button({
        text: 'Авторизоваться',
        events: {
          click: async (e: Event): Promise<void> => {
            e.preventDefault();
            const inputs = document.querySelectorAll('input');
            const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

            if (isValid) {
              const loginInput = document.querySelector('input[name="login"]') as HTMLInputElement;
              const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

              await AuthController.signIn({
                login: loginInput?.value,
                password: passwordInput?.value
              });
            }
          }
        }
      })
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
