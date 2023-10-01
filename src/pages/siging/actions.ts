import { get, post } from '../../API/index';
import { chats, signin, userinfo } from '../../API/serverPaths';
import { User } from '../settings/model';

export const login = ({
  login,
  password,
}: {
  login: string;
  password: string;
}): Promise<unknown> =>
  post(signin, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ login, password }),
    tries: 0,
  });

export const getUserInfo = async (): Promise<User> =>
  get(userinfo, { tries: 0 }) as unknown as User;

export const getChats = () =>
  get(chats, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });
