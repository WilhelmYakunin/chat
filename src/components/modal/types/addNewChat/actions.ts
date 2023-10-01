import { chats } from '../../../../API/serverPaths';
import { post } from '../../../../API';

export const addChat = async (title: string) =>
  post(chats, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ title }),
    tries: 0,
  });
