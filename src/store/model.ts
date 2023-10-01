export type Message = {
  user: {
    first_name: string;
    second_name: string;
    avatar: null | string;
    email: string;
    login: string;
    phone: string;
  };
  time: Date;
  content: string;
};

export type IChat = {
  id: string;
  title: string;
  avatar: null | string;
  unread_count: number;
  created_by: string;
  last_message: null | Message;
};

export interface IState {
  isAuth: boolean;
  isLoad: boolean;
  signin: { login: string; password: string };
  signup: { login: string; password: string };
  settings: {
    id: string;
    avatar: string;
    first_name: string;
    last_name: string;
    display_name: string;
    login: string;
    old_password: string;
    email: string;
    phone: string;
    errors: {
      first_name: boolean;
      second_name: boolean;
      display_name: boolean;
      login: boolean;
      email: boolean;
      old_password: boolean;
      new_password: boolean;
      phone: boolean;
    };
  };
  modal: {
    type: string;
    inputValue: string;
  };
  chatList: IChat[];
}
