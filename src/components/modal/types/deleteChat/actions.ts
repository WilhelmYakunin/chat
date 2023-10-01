import { chats } from '../../../../API/serverPaths';
import { delet } from '../../../../API';

export const deletChat = (chatId: number) =>
  delet(chats, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ chatId }),
    tries: 0,
  });
