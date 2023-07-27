import loginPage from './src/pages/login';
import signupPage from './src/pages/signup';
import messengerPage from './src/pages/main/messenger';
import userPage from './src/pages/user';
import { routes } from './src/router/routes';
import Router from './src/router/router';

const { login, singup, messenger, settings } = routes;
const router = new Router('app');

router
  .use(login(), loginPage())
  .use(messenger(), messengerPage())
  .use(singup(), signupPage())
  .use(settings(), userPage())
  .start();
