import { UserApi } from '../api/user.api.ts';
import Router from '../utils/router.ts';
import { ROUTES } from '../const/paths.ts';
import store from '../store/store.ts';

const router = new Router("#app");

class UserController {
  private readonly api: UserApi;

  constructor() {
    this.api = new UserApi();
  }

  async signIn(data: Record<string, unknown>) {
    try {
      await this.api.signIn(data);

      router.go(ROUTES.CHAT);
    } catch (e) {
      console.error(e);
    }
  }

  async signUp(data: Record<string, unknown>) {
    try {
      await this.api.signUp(data);
      await this.fetchUser();
      router.go(ROUTES.CHAT);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchUser() {
    try {
      const xhr = await this.api.read();
      store.set('user.data', JSON.parse(xhr.response));
    } catch (e) {
      console.error(e);
    }
  }

  async logout() {
    try {
      await this.api.logout();

      router.go(ROUTES.LOGIN);
    } catch (e) {
      console.error(e);
    }
  }

  async updateProfile(data: Record<string, unknown>) {
    try {
      const xhr = await this.api.updateProfile(data);
      console.log('Update success', xhr.response);
      store.set("user.data", JSON.parse(xhr.response));
      router.go(ROUTES.PROFILE);
    } catch (e) {
      console.error('Update failed:', (e as XMLHttpRequest).response);
      try {
        const errorResp = JSON.parse((e as XMLHttpRequest).response);
        alert(errorResp.reason || "Ошибка при обновлении профиля");
      } catch {
        alert("Произошла ошибка при отправке данных");
      }
    }
  }

  async updatePassword(data: Record<string, unknown>) {
    try {
      await this.api.updatePassword(data);
      alert("Пароль успешно обновлен");
      router.go(ROUTES.PROFILE);
    } catch (e) {
      console.error('Password update failed:', (e as XMLHttpRequest).response);
      try {
        const errorResp = JSON.parse((e as XMLHttpRequest).response);
        alert(errorResp.reason || "Ошибка при смене пароля");
      } catch {
        alert("Произошла ошибка при отправке данных");
      }
    }
  }

  async changeAvatar(data: FormData) {
    try {
      const xhr = await this.api.changeAvatar(data);
      store.set("user.data", JSON.parse(xhr.response));
    } catch (e) {
      const xhr = e as XMLHttpRequest;
      console.error('Avatar update failed:', xhr);

      if (xhr.status === 413) {
         alert("Файл слишком большой. Сервер отклонил загрузку.");
         return;
      }

      try {
        if (xhr.response) {
            const errorResp = JSON.parse(xhr.response);
            alert(errorResp.reason || "Не удалось обновить аватар");
        } else {
            alert("Произошла ошибка при загрузке. Возможно, файл слишком большой или проблема с соединением.");
        }
      } catch {
        alert("Не удалось обновить аватар");
      }
    }
  }
}

export default new UserController();
