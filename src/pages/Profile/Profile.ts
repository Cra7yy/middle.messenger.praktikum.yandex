import template from './Profile.hbs?raw';
import './Profile.scss';
import Block from '../../framework/Block';
import type { Profile } from '../../type/page.type.ts';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile.ts';
import { ImageProfile } from '../../components/ImageProfile/ImageProfile.ts';
import { ProfileData } from '../../components/ProfileData/ProfileData.ts';

class ProfilePage extends Block {
  constructor(props: Profile) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

export const profilePage = new ProfilePage({
  nameUser: 'Иван',
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
  EmailBlock: new ProfileData({
    label: 'Почта',
    value: 'pochta@yandex.ru'
  }),
  LoginBlock: new ProfileData({
    label: 'Логин',
    value: 'ivanivanov'
  }),
  FirstNameBlock: new ProfileData({
    label: 'Имя',
    value: 'Иван'
  }),
  LastNameBlock: new ProfileData({
    label: 'Фамилия',
    value: 'Иванов'
  }),
  DisplayNameBlock: new ProfileData({
    label: 'Имя в чате',
    value: 'Иван'
  }),
  PhoneBlock: new ProfileData({
    label: 'Телефон',
    value: '+7 (909) 967 30 30'
  })
});
