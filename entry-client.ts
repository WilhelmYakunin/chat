import signinPage from './src/pages/siging/singin';
import signupPage from './src/pages/signup/signup';
import messengerPage from './src/pages/messenger/messenger';
import settingsPage from './src/pages/settings/settings';
import { routes } from './src/router/routes';
import router from './src/router/routerInit';

import notFoundPage from './src/pages/notFound';
import ServerErrorPage from './src/pages/serverError';

const { sigin, singup, messenger, settings, nonExisted, serverError } = routes;

router
  .use(messenger(), messengerPage)
  .use(sigin(), signinPage)
  .use(singup(), signupPage)
  .use(settings(), settingsPage)
  .use(nonExisted(), notFoundPage)
  .use(serverError(), ServerErrorPage)
  .start();
