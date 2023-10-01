import { post } from '../../API';
import { getChatToken, resoursecURL } from '../../API/serverPaths';
import { getImageUrl } from '../helpers';
import noChatAva from './pictures/chat-chat-svgrepo-com.svg';

export const setChatAvatart = (url: string | null) => {
  if (!url) return getImageUrl(noChatAva);
  return getImageUrl(resoursecURL.concat(url));
};

export const getAvatar = (url: string | null) => {
  if (!url) return getImageUrl(noChatAva);
  return getImageUrl(resoursecURL.concat(url));
};

export const getToken = (chatId: string) =>
  post(getChatToken(chatId), {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });
