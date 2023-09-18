import { usersChat, usersSearch } from '../../API/serverPaths';
import { post, put } from '../../API';

export const searchForUser = (login: string) =>
  post(usersSearch, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ login }),
    tries: 0,
  });

export const addUserToChat = ({
  chatId,
  usersIds,
}: {
  chatId: string;
  usersIds: string[];
}) =>
  put(usersChat, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ users: usersIds, chatId }),
    tries: 0,
  });
