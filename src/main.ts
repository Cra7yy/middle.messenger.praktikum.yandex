import './style.css'
import './pages/Error/Error.scss';
import { renderErrorPage } from './pages/Error/Error.ts';
import { renderSignInPage } from './pages/SignIn/SignIn.ts';
import { renderSignUpPage } from './pages/SingUp/SignUp.ts';
import { renderProfilePage } from './pages/Profile/Profile.ts';
import { renderProfileEditPage } from './pages/ProfileEdit/ProfileEdit.ts';
import { renderPasswordEditPage } from './pages/PasswordEdit/PassworldEdit.ts';
import { renderChatPage } from './pages/Chat/Chat.ts';
import { renderLinksPage } from './pages/LinksPage/LinksPage.ts';

const path = window.location.pathname;

if (path === '/500') {
    renderErrorPage(path);
} else if (path === '/signin') {
    renderSignInPage();
} else if (path === '/signup') {
    renderSignUpPage();
} else if (path === '/profile') {
    renderProfilePage();
} else if (path === '/profile/edit') {
    renderProfileEditPage();
} else if (path === '/password/edit') {
    renderPasswordEditPage();
} else if (path === '/chat') {
    renderChatPage();
} else if (path === '/') {
    renderLinksPage();
} else {
    renderErrorPage(path);
}
