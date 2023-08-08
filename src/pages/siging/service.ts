import { post } from '../../API/index';
import { signin } from '../../API/serverPaths';

export const login = ({
  login,
  password,
}: {
  login: string;
  password: string;
}): Promise<unknown> => {
  const url = signin;
  return post(url, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ login, password }),
    tries: 0,
  });
};
