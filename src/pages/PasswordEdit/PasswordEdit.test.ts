import { PasswordEditPage } from './PasswordEdit';
import UserController from '../../controllers/UserController';
import store from '../../store/store';
import { validateForm } from '../../utils/validations';
import { Button } from '../../components/Button/Button';
import { ButtonProfile } from '../../components/ButtonProfile/ButtonProfile';
import Router from '../../utils/router';

jest.mock('../../controllers/UserController', () => ({
  fetchUser: jest.fn(),
  updatePassword: jest.fn(),
  changeAvatar: jest.fn(),
}));

jest.mock('../../utils/validations', () => ({
  handleFocusOut: jest.fn(),
  validateForm: jest.fn(),
}));

jest.mock('../../store/store', () => ({
  __esModule: true,
  default: {
    getState: jest.fn(),
    on: jest.fn(),
    set: jest.fn(),
  },
  StoreEvents: {
    UPDATED: 'updated',
  },
}));

jest.mock('../../utils/router', () => {
  const router = {
    back: jest.fn(),
    go: jest.fn(),
    use: jest.fn().mockReturnThis(),
    start: jest.fn(),
    setAuthorized: jest.fn(),
  };
  return jest.fn(() => router);
});

jest.mock('../../components/InputProfile/InputProfile.ts', () => ({
  InputProfile: class {
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) { this.props = props; }
    getContent() { return document.createElement('div'); }
    setProps() {}
    dispatchComponentDidMount() {}
  }
}));

jest.mock('../../components/Button/Button.ts', () => ({
  Button: class {
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) { this.props = props; }
    getContent() { return document.createElement('div'); }
    setProps() {}
    dispatchComponentDidMount() {}
  }
}));

jest.mock('../../components/ImageProfile/ImageProfile.ts', () => ({
  ImageProfile: class {
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) { this.props = props; }
    getContent() { return document.createElement('div'); }
    setProps(p: Record<string, unknown>) { Object.assign(this.props, p); }
    dispatchComponentDidMount() {}
  }
}));

jest.mock('../../components/ButtonProfile/ButtonProfile.ts', () => ({
  ButtonProfile: class {
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) { this.props = props; }
    getContent() { return document.createElement('div'); }
    setProps() {}
    dispatchComponentDidMount() {}
  }
}));

jest.mock('uuid', () => ({ v4: () => '1234' }));

jest.mock('./PasswordEdit.hbs?raw', () => '<div>Mock Template</div>', { virtual: true });
jest.mock('./PasswordEdit.scss', () => ({}), { virtual: true });

describe('PasswordEditPage', () => {
  let routerMock: { back: jest.Mock; go: jest.Mock; use: jest.Mock; start: jest.Mock; setAuthorized: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    (store.getState as jest.Mock).mockReturnValue({ user: { data: { avatar: '/test.jpg' } } });

    routerMock = new Router('#app') as unknown as typeof routerMock;
  });

  it('должен создать экземпляр класса', () => {
    const page = new PasswordEditPage();
    expect(page).toBeDefined();
  });

  it('должен вызвать UserController.fetchUser при инициализации, если нет данных пользователя', () => {
    (store.getState as jest.Mock).mockReturnValue({ user: null });
    new PasswordEditPage();
    expect(UserController.fetchUser).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать router.back() при клике на кнопку назад', () => {
    const page = new PasswordEditPage();
    const backButton = (page.children.ButtonBack || page.props.ButtonBack) as unknown as ButtonProfile;
    const clickHandler = (backButton.props.events as { click: () => void }).click;

    expect(clickHandler).toBeDefined();
    clickHandler();

    expect(routerMock.back).toHaveBeenCalled();
  });

  it('должен валидировать форму и вызывать updatePassword при сохранении', async () => {
    (validateForm as jest.Mock).mockReturnValue(true);
    const page = new PasswordEditPage();

    document.body.innerHTML = `
      <input name="oldPassword" value="old123" />
      <input name="newPassword" value="new123" />
      <input name="newPasswordAgain" value="new123" />
    `;

    const saveButton = (page.children.ButtonSave || page.props.ButtonSave) as unknown as Button;
    const saveHandler = (saveButton.props.events as { click: (e: Event) => Promise<void> }).click;
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event;

    await saveHandler(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(validateForm).toHaveBeenCalled();
    expect(UserController.updatePassword).toHaveBeenCalledWith({
      oldPassword: 'old123',
      newPassword: 'new123',
      newPasswordAgain: 'new123'
    });
  });

  it('не должен вызывать updatePassword, если валидация не прошла', async () => {
    (validateForm as jest.Mock).mockReturnValue(false);
    const page = new PasswordEditPage();

    const saveButton = (page.children.ButtonSave || page.props.ButtonSave) as unknown as Button;
    const saveHandler = (saveButton.props.events as { click: (e: Event) => Promise<void> }).click;

    await saveHandler({ preventDefault: jest.fn() } as unknown as Event);

    expect(validateForm).toHaveBeenCalled();
    expect(UserController.updatePassword).not.toHaveBeenCalled();
  });
});
