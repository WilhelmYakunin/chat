import { Ischema } from '../../components/helpers/validate';
import { messageFileds } from './model';
import { messagePattern } from '../../components/helpers/validationRules';
import { words } from '../../langs';
import { chats, logout, resoursecURL } from '../../API/serverPaths';
import { get, post } from '../../API';
import { getImageUrl } from '../../components/helpers';

export const getAvatar = (imgLink: string) =>
  getImageUrl(resoursecURL.concat(imgLink));

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

export const getChats = () =>
  get(chats, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });
