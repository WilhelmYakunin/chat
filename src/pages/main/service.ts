import { Ischema } from '../../components/helpers/validate';
import { messageFileds } from './model';
import { messagePattern } from '../../components/helpers/validationRules';
import { words } from '../../langs';
import { logout } from '../../API/serverPaths';
import { post } from '../../API';

export const messageFormSchema: Ischema = {
  [messageFileds.message]: {
    pattern: messagePattern,
    description: words.VALIDATION.PATTERTNS.MESSAGE,
  },
};

export const logOut = () => {
  const url = logout;
  return post(url, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });
};
