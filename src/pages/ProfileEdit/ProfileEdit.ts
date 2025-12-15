import template from './ProfileEdit.hbs?raw';
import './ProfileEdit.scss';
import Block from '../../framework/Block.ts';
import { Button } from '../../components/Button/Button.ts';
import { InputProfile } from '../../components/InputProfile/InputProfile.ts';
import { ImageProfile } from '../../components/ImageProfile/ImageProfile.ts';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile.ts';
import type { ProfileEdit } from '../../type/page.type.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';

class ProfileEditPage extends Block {
  constructor(props: ProfileEdit) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

export const profileEditPage = new ProfileEditPage({
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
  AvatarProfile: new ImageProfile({
    text: 'Поменять аватар',
    src: '/image.svg',
    alt: 'Аватар пользователя',
  }),
  InputEmail: new InputProfile({
    id: 'email',
    label: 'Почта',
    type: 'email',
    name: 'email',
    value: 'pochta@yandex.ru',
    events: { focusout: handleFocusOut }
  }),
  InputLogin: new InputProfile({
    id: 'login',
    label: 'Логин',
    type: 'text',
    name: 'login',
    value: 'ivanivanov',
    events: { focusout: handleFocusOut }
  }),
  InputFirstName: new InputProfile({
    id: 'firstName',
    label: 'Имя',
    type: 'text',
    name: 'first_name',
    value: 'Иван',
    events: { focusout: handleFocusOut }
  }),
  InputSecondName: new InputProfile({
    id: 'secondName',
    label: 'Фамилия',
    type: 'text',
    name: 'second_name',
    value: 'Иванов',
    events: { focusout: handleFocusOut }
  }),
  InputDisplayName: new InputProfile({
    id: 'displayName',
    label: 'Имя в чате',
    type: 'text',
    name: 'display_name',
    value: 'Иван',
    events: { focusout: handleFocusOut }
  }),
  InputPhone: new InputProfile({
    id: 'phone',
    label: 'Телефон',
    type: 'tel',
    name: 'phone',
    value: '+7 (909) 967 30 30',
    events: { focusout: handleFocusOut }
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
          const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
          const loginInput = document.querySelector('input[name="login"]') as HTMLInputElement;
          const firstNameInput = document.querySelector('input[name="first_name"]') as HTMLInputElement;
          const secondNameInput = document.querySelector('input[name="second_name"]') as HTMLInputElement;
          const displayNameInput = document.querySelector('input[name="display_name"]') as HTMLInputElement;
          const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;

          console.log({
            email: emailInput?.value,
            login: loginInput?.value,
            firstName: firstNameInput?.value,
            secondName: secondNameInput?.value,
            displayName: displayNameInput?.value,
            phone: phoneInput?.value
          })
        }
      }
    }
  })
});
