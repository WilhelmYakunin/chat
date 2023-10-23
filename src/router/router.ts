import Block from '../components/block/block';
import Route from './route';
import { routes } from './routes';

export default class Router {
  public routes: Route[] = [];
  public history: History = window.history;
  private _currentRoute: null | Route = null;
  static __instance: Router;
  private _rootQuery!: string;
  private _nonExisted!: typeof Block | null;
  private _onServerError!: typeof Block | null;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;
    this._nonExisted = null;
    this._onServerError = null;

    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block) {
    const route: Route = new Route(pathname, block, {
      rootQuery: this._rootQuery,
    });
    this.routes.push(route);

    if (pathname === routes.nonExisted()) this._nonExisted = block;
    if (pathname === routes.serverError()) this._onServerError = block;

    return this;
  }

  start() {
    window.onpopstate = (event) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    try {
      const route: Route | undefined = this.getRoute(pathname);

      if (this._currentRoute && this._currentRoute !== route) {
        this._currentRoute.leave();
      }

      if (route) {
        this._currentRoute = route;
        route.render();
      } else {
        this.onNonExistedRoute(pathname);
      }
    } catch {
      this.onError(pathname);
    }
  }

  onNonExistedRoute(pathname: string) {
    if (!this._nonExisted) return;
    this._currentRoute = new Route(pathname, this._nonExisted, {
      rootQuery: this._rootQuery,
    });
    this._currentRoute.render();
  }

  onError(pathname: string) {
    if (!this._onServerError) throw Error('Server Error');
    this._currentRoute = new Route(pathname, this._onServerError, {
      rootQuery: this._rootQuery,
    });
    this._currentRoute.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }

  addSuspense(Suspense: typeof Block) {
    const initStateOfLoad = false;
    const child = new Suspense({ isLoad: initStateOfLoad });
    const parent = document.getElementById(this._rootQuery);
    parent?.appendChild(child.getContent());
  }

  addModal(Modal: typeof Block) {
    const child = new Modal();
    const parent = document.getElementById(this._rootQuery);
    parent?.appendChild(child.getContent());
  }
}
