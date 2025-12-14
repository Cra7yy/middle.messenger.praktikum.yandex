import './style.css'
import './pages/Error/Error.scss';
import { clientErrorPage, serverErrorPage } from './pages/Error/Error.ts';
import { signInPage } from './pages/SignIn/SignIn.ts';
import { signUpPage } from './pages/SingUp/SignUp.ts';
import { profilePage } from './pages/Profile/Profile.ts';
import { profileEditPage } from './pages/ProfileEdit/ProfileEdit.ts';
import { passwordEditPage } from './pages/PasswordEdit/PassworldEdit.ts';
import { chatPage } from './pages/Chat/Chat.ts';
import { LinksPage } from './pages/LinksPage/LinksPage.ts';
import Block from './framework/Block.ts';

const path = window.location.pathname;

function renderDOM(block: Block) {
  const root = document.querySelector('#app');
  if (root) {
    root.innerHTML = '';
    const content = block.getContent();
    if (content) {
      root.appendChild(content);
    }
  }
}

if (path === '/500') {
  renderDOM(serverErrorPage);
} else if (path === '/signin') {
  renderDOM(signInPage);
} else if (path === '/signup') {
  renderDOM(signUpPage);
} else if (path === '/profile') {
  renderDOM(profilePage);
} else if (path === '/profile/edit') {
  renderDOM(profileEditPage)
} else if (path === '/password/edit') {
  renderDOM(passwordEditPage);
} else if (path === '/chat') {
  renderDOM(chatPage);
} else if (path === '/') {
  renderDOM(new LinksPage());
} else {
  renderDOM(clientErrorPage);
}
