import { userinfo } from '../../API/serverPaths';
import { get } from '../../API';
import { User } from './model';

export const getUserInfo = async (): Promise<User> =>
  get(userinfo, { tries: 0 });
