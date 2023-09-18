import { get } from '../../API';
import { getChatUsers } from '../../API/serverPaths';
import { User } from '../../pages/settings/model';
import store from '../../store/store';

export const getParticipants = async (id: string) =>
  get(getChatUsers(id), {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    tries: 0,
  });

export const setChatOwnerFirst = (arr: User[]) =>
  arr.map((el, i) => {
    if (el.id === store.getState().settings.id) {
      arr[i] = arr[0];
      arr[0] = el;
    }
  });
