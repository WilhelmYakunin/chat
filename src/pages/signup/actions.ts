import { signup } from '../../API/serverPaths';
import { post } from '../../API';
import { signupFields } from './model';

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

export const getProperType = (fieldName: string | boolean) => {
  switch (fieldName) {
    case signupFields.email:
      return 'email';
    case signupFields.phone:
      return 'tel';
    case signupFields.password_confirm:
    case signupFields.password:
      return 'password';
    default:
      return 'text';
  }
};
