import { chats, logout, resoursecURL } from '../../API/serverPaths';
import { get, post } from '../../API';
import { getImageUrl } from '../../components/helpers';
import noWriterAva from './pictures/noava.png';

export const getAvatar = (imgLink: string | null) => {
  if (!imgLink) return getImageUrl(noWriterAva);
  return getImageUrl(resoursecURL.concat(imgLink));
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
