import { delet } from '../../API';
import { usersChat } from '../../API/serverPaths';

export const deleteChatUsers = ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string[];
}) =>
  delet(usersChat, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ users: userId, chatId }),
    tries: 0,
  });
