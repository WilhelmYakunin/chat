import signinPage from './src/pages/siging/singin';
import signupPage from './src/pages/signup/signup';
import messengerPage from './src/pages/main/messenger';
import settingsPage from './src/pages/settings/settings';
import { routes } from './src/router/routes';
import router from './src/router/router';

const { login, singup, messenger, settings } = routes;

router
  // .use(messenger(), messengerPage)
  .use(singup(), signupPage)
  .use(login(), signinPage)
  .use(settings(), settingsPage)
  .start();
