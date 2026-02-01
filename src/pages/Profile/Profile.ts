import template from './Profile.hbs?raw';
import './Profile.scss';
import Block from '../../framework/Block';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile.ts';
import { ImageProfile } from '../../components/ImageProfile/ImageProfile.ts';
import { ProfileData } from '../../components/ProfileData/ProfileData.ts';
import { ComponentLink } from '../../components/ComponentLink/ComponentLink.ts';
import Router from '../../utils/router.ts';
import { ROUTES } from '../../const/paths.ts';
import AuthController from '../../controllers/UserController.ts';
import store, { StoreEvents } from '../../store/store.ts';
import UserController from '../../controllers/UserController.ts'

const router = new Router("#app");

export class ProfilePage extends Block {
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
      nameUser: display_name || first_name || 'Пользователь',
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
      EmailBlock: new ProfileData({
        label: 'Почта',
        value: email
      }),
      LoginBlock: new ProfileData({
        label: 'Логин',
        value: login
      }),
      FirstNameBlock: new ProfileData({
        label: 'Имя',
        value: first_name
      }),
      LastNameBlock: new ProfileData({
        label: 'Фамилия',
        value: second_name
      }),
      DisplayNameBlock: new ProfileData({
        label: 'Имя в чате',
        value: display_name
      }),
      PhoneBlock: new ProfileData({
        label: 'Телефон',
        value: phone
      }),
      ChangeDataLink: new ComponentLink({
        text: 'Изменить данные',
        className: 'profile__settings-item profile__text',
        events: {
          click: (): void => router.go(ROUTES.SETTINGS)
        }
      }),
      ChangePasswordLink: new ComponentLink({
        text: 'Изменить пароль',
        className: 'profile__settings-item profile__text',
        events: {
          click: (): void => router.go(ROUTES.PASSWORD_CHANGE)
        }
      }),
      LogoutLink: new ComponentLink({
        text: 'Выйти',
        className: 'profile__link profile__text',
        events: {
          click: async (): Promise<void> => {
            await AuthController.logout();
          }
        }
      })
    });

    store.on(StoreEvents.UPDATED, () => {
      const { user } = store.getState();
      const userData = user?.data;

      if (!userData) return;

      this.setProps({ nameUser: userData.display_name || userData.first_name || 'Пользователь' });

      if (userData.avatar) {
        (this.children.AvatarProfile as Block).setProps({
          src: `https://ya-praktikum.tech/api/v2/resources${userData.avatar}`
        });
      }

      (this.children.EmailBlock as Block).setProps({ value: userData.email });
      (this.children.LoginBlock as Block).setProps({ value: userData.login });
      (this.children.FirstNameBlock as Block).setProps({ value: userData.first_name });
      (this.children.LastNameBlock as Block).setProps({ value: userData.second_name });
      (this.children.DisplayNameBlock as Block).setProps({ value: userData.display_name });
      (this.children.PhoneBlock as Block).setProps({ value: userData.phone });
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
