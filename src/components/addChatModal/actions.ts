import { chats } from '../../API/serverPaths';
import { post } from '../../API';
import { IChat } from './model';

export const addChat = async (title: IChat) =>
  post(chats, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify(title),
    tries: 0,
  });
