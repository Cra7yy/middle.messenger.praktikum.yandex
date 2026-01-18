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

  let isAuthorized = false;

  try {
    const response = await userApi.read();
    const userData = JSON.parse(response.response);
    store.set('user.data', userData);
    isAuthorized = true;
  } catch {
    isAuthorized = false;
  }

  router.setAuthorized(isAuthorized);

  router
    .use(ROUTES.LOGIN, SignInPage, false, true)
    .use(ROUTES.REGISTER, SignUpPage, false, true)
    .use(ROUTES.PROFILE, ProfilePage, true)
    .use(ROUTES.SETTINGS, ProfileEditPage, true)
    .use(ROUTES.PASSWORD_CHANGE, PasswordEditPage, true)
    .use(ROUTES.CHAT, ChatPage, true)
    .use(ROUTES.NOT_FOUND, NotFoundPage);

  const knownRoutes = Object.values(ROUTES);
  if (!knownRoutes.includes(window.location.pathname as ROUTES)) {
    router.go(ROUTES.NOT_FOUND);
  } else {
    const currentRoute = router.getRoute(window.location.pathname);
    if (currentRoute?.isProtected() && !isAuthorized) {
      router.go(ROUTES.LOGIN);
    } else if (currentRoute?.isPublicOnly() && isAuthorized) {
      router.go(ROUTES.CHAT);
    }
  }

  router.start();
});
