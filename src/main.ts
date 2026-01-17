import './style.scss'
import { SignInPage } from './pages/SignIn/SignIn.ts';
import { SignUpPage } from './pages/SingUp/SignUp.ts';
import { ProfilePage } from './pages/Profile/Profile.ts';
import { ProfileEditPage } from './pages/ProfileEdit/ProfileEdit.ts';
import { PasswordEditPage } from './pages/PasswordEdit/PasswordEdit.ts';
import { ChatPage } from './pages/Chat/Chat.ts';
import { NotFoundPage } from './pages/Error/Error.ts';
import { ROUTES } from './const/paths.ts';
import Router from './utils/router.ts';
import { UserApi } from './api/user.api.ts';
import store from './store/store.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const router = new Router('#app');
  const userApi = new UserApi();

  try {
    const response = await userApi.read();
    const userData = JSON.parse(response.response);
    store.set('user.data', userData);
    router.setAuthorized(true);
  } catch {
    router.setAuthorized(false);
  }

  router
    .use(ROUTES.LOGIN, SignInPage)
    .use(ROUTES.REGISTER, SignUpPage)
    .use(ROUTES.PROFILE, ProfilePage, true)
    .use(ROUTES.SETTINGS, ProfileEditPage, true)
    .use(ROUTES.PASSWORD_CHANGE, PasswordEditPage, true)
    .use(ROUTES.CHAT, ChatPage, true)
    .use(ROUTES.NOT_FOUND, NotFoundPage);

  const knownRoutes = Object.values(ROUTES);
  if (!knownRoutes.includes(window.location.pathname as ROUTES)) {
    router.go(ROUTES.NOT_FOUND);
  }

  router.start();
});
