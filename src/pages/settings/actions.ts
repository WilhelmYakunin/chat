import {
  userinfo,
  changeUserinfo,
  changeUserAvatart,
  resoursecURL,
} from '../../API/serverPaths';
import { get, put } from '../../API';
import { User, UserDTO, userInfoFields } from './model';
import { getImageUrl } from '../../components/helpers';

export const getUserInfo = async (): Promise<User> =>
  get(userinfo, { tries: 0 }) as unknown as User;

export const changeUserInfo = async (newUserInfo: UserDTO) =>
  put(changeUserinfo, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify(newUserInfo),
    tries: 0,
  });

export const getProperType = (fieldName: string | boolean) => {
  switch (fieldName) {
    case userInfoFields.email:
      return 'email';
    case userInfoFields.phone:
      return 'tel';
    case userInfoFields.old_password:
    case userInfoFields.new_password:
      return 'password';
    default:
      return 'text';
  }
};

export const changeUserAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  put(changeUserAvatart, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'PUT',
    },
    data: formData,
    tries: 0,
  });
};

export const getAvatar = (imgLink: string | null) => {
  if (!imgLink) return getImageUrl('pictures/' + 'noava' + '.svg');
  return getImageUrl(resoursecURL.concat(imgLink));
};
