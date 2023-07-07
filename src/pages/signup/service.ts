import { Ischema } from '../../components/helpers/validate';
import { signupFields } from './model';
import {
  emailPattern,
  loginPattern,
  namePattern,
  passwordPattern,
  phonePattern,
} from '../../components/helpers/validationRules';
import { words } from '../../langs';

export const signupFormSchema: Ischema = {
  [signupFields.first_name]: {
    pattern: namePattern,
    description: words.VALIDATION.PATTERTNS.FIRST_NAME,
  },
  [signupFields.second_name]: {
    pattern: namePattern,
    description: words.VALIDATION.PATTERTNS.SECOND_NAME,
  },
  [signupFields.login]: {
    pattern: loginPattern,
    description: words.VALIDATION.PATTERTNS.LOGIN,
  },
  [signupFields.password]: {
    pattern: passwordPattern,
    description: words.VALIDATION.PATTERTNS.PASSWORD,
  },
  [signupFields.password_confirm]: {
    pattern: passwordPattern,
    description: words.VALIDATION.PATTERTNS.CONFIRM_PASSWORD,
  },
  [signupFields.email]: {
    pattern: emailPattern,
    description: words.VALIDATION.PATTERTNS.EMAIL,
  },
  [signupFields.phone]: {
    pattern: phonePattern,
    description: words.VALIDATION.PATTERTNS.PHONE,
  },
};
