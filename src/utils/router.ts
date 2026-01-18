import Block from '../framework/Block';
import isEqual from './isEqual';

function render(query: string, block: Block): HTMLElement {
  const root = document.querySelector(query);

  if (!root) {
    throw new Error(`Root element not found by selector: "${query}"`);
  }

  if (!(root instanceof HTMLElement)) {
    throw new Error(`Element found by selector "${query}" is not an HTMLElement (got ${root.tagName || 'unknown'})`);
  }

  root.innerHTML = '';

  const content = block.getContent();
  if (!content) {
    throw new Error('Block content is null');
  }

  if (!(content instanceof HTMLElement)) {
    throw new Error('Block content is not an HTMLElement');
  }

  root.append(content);
  return root;
}

interface RouteProps {
  rootQuery: string;
}

class Route {
  private _pathname: string;
  private _blockClass: typeof Block;
  private _block: Block | null = null;
  private _props: RouteProps;
  private _isProtected: boolean;
  private _isPublicOnly: boolean;

  constructor(pathname: string, view: typeof Block, props: RouteProps, isProtected: boolean = false, isPublicOnly: boolean = false) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
    this._isProtected = isProtected;
    this._isPublicOnly = isPublicOnly;
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return isEqual({ path: pathname }, { path: this._pathname });
  }

  render(): void {
    this._block = new this._blockClass();
    render(this._props.rootQuery, this._block);
  }

  isProtected(): boolean {
    return this._isProtected;
  }

  isPublicOnly(): boolean {
    return this._isPublicOnly;
  }
}

class Router {
  private static __instance: Router | null = null;

  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery!: string;
  private _isAuthorized: boolean = false;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block, isProtected: boolean = false, isPublicOnly: boolean = false): Router {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery }, isProtected, isPublicOnly);
    this.routes.push(route);
    return this;
  }

  setAuthorized(isAuthorized: boolean): void {
    this._isAuthorized = isAuthorized;
    if (!isAuthorized && this._currentRoute?.isProtected()) {
      this.go('/');
    }
  }

  start(): void {
    window.addEventListener('popstate', () => {
      const pathname = window.location.pathname;
      const route = this.getRoute(pathname);

      if (route?.isProtected() && !this._isAuthorized) {
        this.go('/');
        return;
      }

      if (route?.isPublicOnly() && this._isAuthorized) {
        this.go('/messenger');
        return;
      }

      this._onRoute(pathname);
    });

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const newRoute = this.getRoute(pathname);

    if (!newRoute) {
      return;
    }

    if (newRoute.isProtected() && !this._isAuthorized) {
      this.go('/');
      return;
    }

    if (newRoute.isPublicOnly() && this._isAuthorized) {
      this.go('/messenger');
      return;
    }

    if (this._currentRoute && this._currentRoute !== newRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = newRoute;
    this._currentRoute.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  getRoute(pathname: string): Route | null {
    return this.routes.find(route => route.match(pathname)) || null;
  }
}

export default Router;
