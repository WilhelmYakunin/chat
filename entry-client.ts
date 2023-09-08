import signinPage from './src/pages/siging/singin';
import signupPage from './src/pages/signup/signup';
import messengerPage from './src/pages/messenger/messenger';
import settingsPage from './src/pages/settings/settings';
import { routes } from './src/router/routes';
import router from './src/router/router';

const { sigin, singup, messenger, settings } = routes;

router
  .use(messenger(), messengerPage)
  .use(singup(), signupPage)
  .use(sigin(), signinPage)
  .use(settings(), settingsPage)
  .start();
