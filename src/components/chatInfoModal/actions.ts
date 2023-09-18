import { getChatUsers, usersChat, usersSearch } from '../../API/serverPaths';
import { get, post, put, delet } from '../../API';

export const getParticipants = async (id: string) =>
  get(getChatUsers(id), {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });

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

export const deleteChatUsers = ({
  chatId,
  usersIds,
}: {
  chatId: string;
  usersIds: string[];
}) =>
  delet(usersChat, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ users: usersIds, chatId }),
    tries: 0,
  });
