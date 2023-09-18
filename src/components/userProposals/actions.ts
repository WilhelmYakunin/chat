import { getImageUrl } from '../helpers';
import noChatAva from './pictures/chat-chat-svgrepo-com.svg';
import noWriterAva from './pictures/writer-svgrepo-com.svg';

export const setChatAvatart = (url: string | null) => {
  if (!url) return getImageUrl(noChatAva);
  return url;
};

export const getAvatar = (url: string | null) => {
  if (!url) return getImageUrl(noWriterAva);
  return url;
};
