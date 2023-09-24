import { changePassword } from '../../../../API/serverPaths';
import { put } from '../../../../API';

export const chagePasswrod = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) =>
  put(changePassword, {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({ oldPassword, newPassword }),
    tries: 0,
  });
