import Router from './router';
import Block from '../framework/Block';

jest.mock('../framework/Block', () => {
  return class MockBlock {
    getContent = jest.fn(() => {
      const div = document.createElement('div');
      div.setAttribute('class', 'block-mock');
      return div;
    });
    hide = jest.fn();
    show = jest.fn();
  };
});

jest.mock('./isEqual', () => ({
  __esModule: true,
  default: (lhs: unknown, rhs: unknown) => JSON.stringify(lhs) === JSON.stringify(rhs),
}));

describe('Router', () => {
  let router: Router;
  const rootQuery = '#app';

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';

    // @ts-expect-error Reset singleton for testing
    Router.__instance = null;


    window.history.replaceState({}, '', '/');

    router = new Router(rootQuery);
  });

  it('should be a singleton', () => {
    const newRouter = new Router(rootQuery);
    expect(newRouter).toBe(router);
  });

  it('should return router instance on use()', () => {
    const result = router.use('/', Block as unknown as typeof Block);
    expect(result).toBe(router);
  });

  it('should render page on start()', () => {
    router.use('/', Block as unknown as typeof Block);
    router.start();

    const root = document.querySelector(rootQuery);
    expect(root?.querySelector('.block-mock')).not.toBeNull();
  });

  it('should change history state on go()', () => {
    router.use('/new-path', Block as unknown as typeof Block);

    router.go('/new-path');

    expect(window.location.pathname).toBe('/new-path');
    expect(window.history.length).toBeGreaterThan(1);
  });

  it('should redirect to "/" if route is protected and user is not authorized', () => {
    const protectedPath = '/settings';

    router
      .use('/', Block as unknown as typeof Block)
      .use(protectedPath, Block as unknown as typeof Block, true); // true = protected

    router.setAuthorized(false);
    router.go(protectedPath);

    expect(window.location.pathname).toBe('/');
  });

  it('should redirect to "/messenger" if route is public-only and user is authorized', () => {
    const loginPath = '/login';
    const messengerPath = '/messenger';

    router
      .use(messengerPath, Block as unknown as typeof Block)
      .use(loginPath, Block as unknown as typeof Block, false, true); // protected=false, publicOnly=true

    router.setAuthorized(true);
    router.go(loginPath);

    expect(window.location.pathname).toBe(messengerPath);
  });

  it('should call history.back() on back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    router.back();
    expect(spy).toHaveBeenCalled();
  });
});
