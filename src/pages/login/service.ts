import { Ischema } from '../../components/helpers/validate';
import { loginFields } from './model';
import {
  loginPattern,
  passwordPattern,
} from '../../components/helpers/validationRules';
import { words } from '../../langs';

export const loginFormSchema: Ischema = {
  [loginFields.login]: {
    pattern: loginPattern,
    description: words.VALIDATION.PATTERTNS.LOGIN,
  },
  [loginFields.password]: {
    pattern: passwordPattern,
    description: words.VALIDATION.PATTERTNS.PASSWORD,
  },
};
