import { chatAvatar } from '../../../../API/serverPaths';
import { put } from '../../../../API';

export const changeChatAvatar = async ({
  file,
  chatId,
}: {
  file: File;
  chatId: string;
}) => {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('chatId', chatId);
  return put(chatAvatar, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'PUT',
    },
    data: formData,
    tries: 0,
  });
};
