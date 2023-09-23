import { logout } from '../../../../API/serverPaths';
import { post } from '../../../../API';

export const logOut = () =>
  post(logout, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });
