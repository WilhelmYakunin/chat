import { signup } from '../../API/serverPaths';
import { post } from '../../API';

export type ISignup = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
};

export const sigUp = async (userinfo: ISignup) => {
  return post(signup, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify(userinfo),
    tries: 0,
  });
};
