import template from './ProfileEdit.hbs?raw';
import './ProfileEdit.scss';
import Block from '../../framework/Block.ts';
import { Button } from '../../components/Button/Button.ts';
import { InputProfile } from '../../components/InputProfile/InputProfile.ts';
import { ImageProfile } from '../../components/ImageProfile/ImageProfile.ts';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';
import Router from '../../utils/router.ts'
import UserController from '../../controllers/UserController.ts'
import store, { StoreEvents } from '../../store/store.ts';

const router = new Router('#app');

export class ProfileEditPage extends Block {
  constructor() {
    const { user } = store.getState();
    const {
      email = '',
      login = '',
      first_name = '',
      second_name = '',
      display_name = '',
      phone = '',
      avatar = ''
    } = user?.data || {};

    if (!user?.data) {
      UserController.fetchUser();
    }

    super('main', {
      ButtonBack: new ButtonProfile({
        type: 'button',
        src: '/arrow_left.svg',
        alt: 'Кнопка назад',
        id: 'button-back',
        events: {
          click: (): void => {
            router.back();
          }
        }
      }),
      AvatarProfile: new ImageProfile({
        text: 'Поменять аватар',
        src: avatar ? `https://ya-praktikum.tech/api/v2/resources${avatar}` : '/image.svg',
        alt: 'Аватар пользователя',
        events: {
          click: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (file) {
                if (file.size > 1024 * 1024) {
                   alert('Файл слишком большой. Максимальный размер 1 МБ. Пожалуйста, сожмите изображение или выберите другое.');
                   return;
                }
                const formData = new FormData();
                formData.append('avatar', file);
                await UserController.changeAvatar(formData);
              }
            };
            input.click();
          }
        }
      }),
      InputEmail: new InputProfile({
        id: 'email',
        label: 'Почта',
        type: 'email',
        name: 'email',
        value: email,
        events: { focusout: handleFocusOut }
      }),
      InputLogin: new InputProfile({
        id: 'login',
        label: 'Логин',
        type: 'text',
        name: 'login',
        value: login,
        events: { focusout: handleFocusOut }
      }),
      InputFirstName: new InputProfile({
        id: 'firstName',
        label: 'Имя',
        type: 'text',
        name: 'first_name',
        value: first_name,
        events: { focusout: handleFocusOut }
      }),
      InputSecondName: new InputProfile({
        id: 'secondName',
        label: 'Фамилия',
        type: 'text',
        name: 'second_name',
        value: second_name,
        events: { focusout: handleFocusOut }
      }),
      InputDisplayName: new InputProfile({
        id: 'displayName',
        label: 'Имя в чате',
        type: 'text',
        name: 'display_name',
        value: display_name,
        events: { focusout: handleFocusOut }
      }),
      InputPhone: new InputProfile({
        id: 'phone',
        label: 'Телефон',
        type: 'tel',
        name: 'phone',
        value: phone,
        events: { focusout: handleFocusOut }
      }),
      ButtonSave: new Button({
        text: 'Сохранить',
        type: 'submit',
        events: {
          click: async (e: Event) => {
            e.preventDefault();
            const inputs = document.querySelectorAll('input');
            const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

            if (isValid) {
              const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
              const loginInput = document.querySelector('input[name="login"]') as HTMLInputElement;
              const firstNameInput = document.querySelector('input[name="first_name"]') as HTMLInputElement;
              const secondNameInput = document.querySelector('input[name="second_name"]') as HTMLInputElement;
              const displayNameInput = document.querySelector('input[name="display_name"]') as HTMLInputElement;
              const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;

              await UserController.updateProfile({
                email: emailInput?.value,
                login: loginInput?.value,
                first_name: firstNameInput?.value,
                second_name: secondNameInput?.value,
                display_name: displayNameInput?.value,
                phone: phoneInput?.value
              })
            }
          }
        }
      })
    });

    store.on(StoreEvents.UPDATED, () => {
      const { user } = store.getState();
      const userData = user?.data;

      if (!userData) return;

      if (userData.avatar) {
        (this.children.AvatarProfile as Block).setProps({
          src: `https://ya-praktikum.tech/api/v2/resources${userData.avatar}`
        });
      }

      const inputsMapping: Record<string, Block> = {
        email: this.children.InputEmail as Block,
        login: this.children.InputLogin as Block,
        first_name: this.children.InputFirstName as Block,
        second_name: this.children.InputSecondName as Block,
        display_name: this.children.InputDisplayName as Block,
        phone: this.children.InputPhone as Block
      };

      Object.entries(inputsMapping).forEach(([key, component]) => {
        if (userData[key as keyof typeof userData]) {
          component.setProps({ value: userData[key as keyof typeof userData] });
        }
      });
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
