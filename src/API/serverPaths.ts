export const origin = 'http://localhost:3000/';
export const baseURL = 'https://ya-praktikum.tech/api/v2';
export const resoursecURL = baseURL.concat('/resources');
export const wsURL = 'wss://ya-praktikum.tech/ws';

export const signup = baseURL.concat('/auth/signup');
export const signin = baseURL.concat('/auth/signin');
export const logout = baseURL.concat('/auth/logout');
export const userinfo = baseURL.concat('/auth/user');
export const changeUserinfo = baseURL.concat('/user/profile');
export const changeUserAvatart = baseURL.concat('/user/profile/avatar');
export const chats = baseURL.concat('/chats');
export const getChatUsers = (id: string) =>
  baseURL.concat('/chats/', id, '/users');
export const usersChat = baseURL.concat('/chats/users');
export const usersSearch = baseURL.concat('/user/search');
export const chatAvatar = baseURL.concat('/chats/avatar');
export const getChatToken = (chatId: string) =>
  baseURL.concat('/chats/token/') + chatId;
