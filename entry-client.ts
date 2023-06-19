import loginPage from './src/pages/login';
import signupPage from './src/pages/signup';
import mainPage from './src/pages/main';
import userPage from './src/pages/user';
import notFoundPage from './src/pages/notFound.ts';
import serverError from './src/pages/serverError';
import { routes } from './src/routes';

const { pathname } = window.location;
const { main, profile, login, singup } = routes;

try {
  switch (pathname) {
    case main():
      mainPage();
      break;
    case profile():
      userPage();
      break;
    case login():
      loginPage();
      break;
    case singup():
      signupPage();
      break;
    default:
      notFoundPage();
  }
} catch (err) {
  serverError();
}
