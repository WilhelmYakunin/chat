import { Ischema } from '../../components/helpers/validate';
import { userInfoFields } from './model';
import {
  namePattern,
  loginPattern,
  passwordPattern,
  phonePattern,
  messagePattern,
  emailPattern,
} from '../../components/helpers/validationRules';
import { words } from '../../langs';

export const userFormSchema: Ischema = {
  [userInfoFields.first_name]: {
    pattern: namePattern,
    description: words.VALIDATION.PATTERTNS.FIRST_NAME,
  },
  [userInfoFields.second_name]: {
    pattern: namePattern,
    description: words.VALIDATION.PATTERTNS.SECOND_NAME,
  },
  [userInfoFields.display_name]: {
    pattern: messagePattern,
    description: words.VALIDATION.PATTERTNS.MESSAGE,
  },
  [userInfoFields.login]: {
    pattern: loginPattern,
    description: words.VALIDATION.PATTERTNS.LOGIN,
  },
  [userInfoFields.email]: {
    pattern: emailPattern,
    description: words.VALIDATION.PATTERTNS.EMAIL,
  },
  [userInfoFields.new_password]: {
    pattern: passwordPattern,
    description: words.VALIDATION.PATTERTNS.PASSWORD,
  },
  [userInfoFields.old_password]: {
    pattern: passwordPattern,
    description: words.VALIDATION.PATTERTNS.PASSWORD,
  },
  [userInfoFields.phone]: {
    pattern: phonePattern,
    description: words.VALIDATION.PATTERTNS.PHONE,
  },
};
