export enum userInfoFields {
  first_name = 'first_name',
  second_name = 'second_name',
  display_name = 'display_name',
  login = 'login',
  email = 'email',
  old_password = 'old_password',
  new_password = 'new_password',
  phone = 'phone',
}

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface UserDTO {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export enum requiredFileds {
  first_name,
  second_name,
  display_name,
  login,
  email,
  phone,
}
