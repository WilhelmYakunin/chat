const host = '/';

export const routes = {
  sigin: () => host,
  singup: () => host + 'sign-up',
  messenger: () => host + 'messenger',
  settings: () => host + 'settings',
  nonExisted: () => '*',
  serverError: () => '5**',
};
