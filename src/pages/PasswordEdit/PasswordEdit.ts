import template from './PasswordEdit.hbs?raw';
import './PasswordEdit.scss';
import Block from '../../framework/Block.ts';
import { InputProfile } from '../../components/InputProfile/InputProfile.ts';
import { Button } from '../../components/Button/Button.ts';
import { ImageProfile } from '../../components/ImageProfile/ImageProfile.ts';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';
import Router from '../../utils/router.ts'
import UserController from '../../controllers/UserController.ts'
import store, { StoreEvents } from '../../store/store.ts';

const router = new Router('#app');

export class PasswordEditPage extends Block {
  constructor() {
    const { user } = store.getState();
    const { avatar = '' } = user?.data || {};

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
          click: () => {
            router.back();
          }
        }
      }),
      InputOldPassword: new InputProfile({
        id: 'oldPassword',
        label: 'Старый пароль',
        type: 'password',
        name: 'oldPassword',
        value: '',
        events: { focusout: handleFocusOut }
      }),
      InputNewPassword: new InputProfile({
        id: 'newPassword',
        label: 'Новый пароль',
        type: 'password',
        name: 'newPassword',
        value: '',
        events: { focusout: handleFocusOut }
      }),
      InputNewPasswordAgain: new InputProfile({
        id: 'newPasswordAgain',
        label: 'Повторите новый пароль',
        type: 'password',
        name: 'newPasswordAgain',
        value: '',
        events: { focusout: handleFocusOut }
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
      ButtonSave: new Button({
        text: 'Сохранить',
        type: 'submit',
        events: {
          click: async (e: Event) => {
            e.preventDefault();
            const inputs = document.querySelectorAll('input');
            const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

            if (isValid) {
              const oldPasswordInput = document.querySelector('input[name="oldPassword"]') as HTMLInputElement;
              const newPasswordInput = document.querySelector('input[name="newPassword"]') as HTMLInputElement;
              const newPasswordAgainInput = document.querySelector('input[name="newPasswordAgain"]') as HTMLInputElement;

              await UserController.updatePassword({
                oldPassword: oldPasswordInput?.value,
                newPassword: newPasswordInput?.value,
                newPasswordAgain: newPasswordAgainInput?.value
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
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
