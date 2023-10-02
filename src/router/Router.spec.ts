import { expect } from 'chai';

import Router from './router';
import Block from '../components/block/block';
import { routes } from './routes';
import Route from './route';

describe('ROUTER TESTS:', () => {
  const router = new Router('#root');

  class Messages extends Block {}

  class Login extends Block {}

  class Singup extends Block {}

  class Settings extends Block {}

  class Error404 extends Block {}

  class Error500 extends Block {}

  const { sigin, singup, messenger, settings, serverError, nonExisted } =
    routes;

  router
    .use(messenger(), Messages)
    .use(sigin(), Login)
    .use(singup(), Singup)
    .use(settings(), Settings)
    .use(nonExisted(), Error404)
    .use(serverError(), Error500)
    .start();

  it('Router enables history', () => {
    router.go(sigin());
    router.go(messenger());
    router.go('/nonexisted');
    expect(router.history.length).to.eq(4);
  });

  it('Router properly parses url', () => {
    const { pathname } = router.getRoute(messenger()) as Route;
    expect(pathname).to.eq(messenger());
  });
});
