import template from './PasswordEdit.hbs?raw';
import './PasswordEdit.scss';
import Block from '../../framework/Block.ts';
import type { PasswordEdit } from '../../type/page.type.ts';
import { InputProfile } from '../../components/InputProfile/InputProfile.ts';
import { Button } from '../../components/Button/Button.ts';
import { ImageProfile } from '../../components/ImageProfile/ImageProfile.ts';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';

class PasswordEditPage extends Block {
  constructor(props: PasswordEdit) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

export const passwordEditPage = new PasswordEditPage({
  ButtonBack: new ButtonProfile({
    type: 'button',
    src: '/arrow_left.svg',
    alt: 'Кнопка назад',
    id: 'button-back',
    events: {
      click: () => {
        window.history.back();
      }
    }
  }),
  InputOldPassword: new InputProfile({
    id: 'oldPassword',
    label: 'Старый пароль',
    type: 'password',
    name: 'oldPassword',
    value: 'password',
    events: { focusout: handleFocusOut }
  }),
  InputNewPassword: new InputProfile({
    id: 'newPassword',
    label: 'Новый пароль',
    type: 'password',
    name: 'newPassword',
    value: 'new_password',
    events: { focusout: handleFocusOut }
  }),
  InputNewPasswordAgain: new InputProfile({
    id: 'newPasswordAgain',
    label: 'Повторите новый пароль',
    type: 'password',
    name: 'newPasswordAgain',
    value: 'new_password',
    events: { focusout: handleFocusOut }
  }),
  AvatarProfile: new ImageProfile({
    text: 'Поменять аватар',
    src: '/image.svg',
    alt: 'Аватар пользователя',
  }),
  ButtonSave: new Button({
    text: 'Сохранить',
    type: 'submit',
    events: {
      click: (e: Event) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('input');
        const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

        if (isValid) {
          const oldPasswordInput = document.querySelector('input[name="oldPassword"]') as HTMLInputElement;
          const newPasswordInput = document.querySelector('input[name="newPassword"]') as HTMLInputElement;
          const newPasswordAgainInput = document.querySelector('input[name="newPasswordAgain"]') as HTMLInputElement;

          console.log({
            oldPassword: oldPasswordInput?.value,
            newPassword: newPasswordInput?.value,
            newPasswordAgain: newPasswordAgainInput?.value
          })
        }
      }
    }
  })
});
