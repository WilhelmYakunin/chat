interface IWords {
  [x: string]: string | { [x: string]: unknown };
  inputs: {
    [x: string]: {
      name?: string;
      placeholder?: string;
      matchPttern: RegExp | string;
      rule?: string;
    };
  };
}
export const words: IWords = {
  inputs: {
    login: {
      name: 'login',
      placeholder: 'Login',
      matchPttern: /[A-Za-z0-9_\\-]{3,20}$/,
      rule: '3-20 Latin char, no spaces, - and _ are allowed',
    },
    password: {
      name: 'password',
      placeholder: 'Password',
      matchPttern: /(^[A-Z]{1}[a-z\\-]$)|(^[А-Я]{1}[а-я\\-]$)/,
      rule: '8 to 40 characters, at least one Big letter and number',
    },
    password_confirm: {
      name: 'password_confirm',
      placeholder: 'Password confirm',
      matchPttern: /(^[A-Z]{1}[a-z\\-]$)|(^[А-Я]{1}[а-я\\-]$)/,
      rule: '8 to 40 characters, at least one Big letter and number',
    },
    first_name: {
      name: 'first_name',
      placeholder: 'First name',
      matchPttern: /(^[A-Z]{1}[a-z\\-]{1,14}$)|(^[А-Я]{1}[а-я\\-]{1,14}$)/,
      rule: 'Latin/Cyrillic, first letter is capital, no spaces and no numbers, only - is allowed',
    },
    second_name: {
      name: 'second_name',
      placeholder: 'Second name',
      matchPttern: /(^[A-Z]{1}[a-z\\-]{1,14}$)|(^[А-Я]{1}[а-я\\-]{1,14}$)/,
      rule: 'Latin/Cyrillic, first letter is capital, no spaces and no numbers, only - is allowed',
    },
    email: {
      name: 'email',
      placeholder: 'E-mail',
      matchPttern:
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
      rule: 'Enter valid e-mail',
    },
    phone: {
      name: 'phone',
      placeholder: 'Phone',
      matchPttern:
        /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im,
      rule: '10 to 15 characters, consists of numbers, may start with +',
    },
    display_name: {
      name: 'display_name',
      placeholder: 'Display name',
      matchPttern: /^\s+$/,
      rule: 'Must be not empty',
    },
    old_password: {
      name: 'old_password',
      placeholder: 'Old password',
      matchPttern: /(^[A-Z]{1}[a-z\\-]{1,14}$)|(^[А-Я]{1}[а-я\\-]{1,14}$)/,
      rule: 'Must must match to current password',
    },
    new_password: {
      name: 'new_password',
      placeholder: 'New password',
      matchPttern: /(^[A-Z]{1}[a-z\\-]{1,14}$)|(^[А-Я]{1}[а-я\\-]{1,14}$)/,
      rule: 'Latin/Cyrillic, first letter is capital, no spaces and no numbers, only - is allowed',
    },
  },
  SIGN_IN: 'Sign&#160;in',
  LOGOUT: 'Logout',
  REMEMBER: 'Remember&#160;me',
  FORGOT: 'Forgot&#160;Password',
  NO_ACCOUNT: 'Create a profile?',
  IS_ACCOUNT: 'Already have an account?',
  SIGN_UP: 'Sign&#160;up',
  FIRST_NAME: 'First&#160;name',
  SECOND_NAME: 'Last&#160;name',
  EMAIL: 'Email',
  PHONE: 'Phone',
  CONFIRM_PASSWORD: 'Confirm&#160;password',
  CONFIRM_POLICY: 'I Agree with',
  PRIVACY: 'privacy policy',
  PROFILE: "User's settings",
  CHANGE_AVATAR: 'Change&#160;avatar',
  DISPLAY_NAME: 'Dispaly&#160;name',
  OLD_PASSWORD: 'Old&#160;password',
  NEW_PASSWORD: 'New&#160;password',
  APPLY_CHANGES: 'Apply&#160;changes',
  NOT_FOUND: 'Page not found',
  NOT_FOUND_NUMBER: '404',
  SERVER_ERROR_NUMBER: '5**',
  SERVER_ERROR: "We're trying to cope with the problem",
  TO_HOME: 'Get&#160;back',
  CHATS_HEADER: 'Chats',
  MESSAGE: 'Put&#160;a&#160;message',
  SEARCH_PLACEHOLDER: 'Search',
  VALIDATION: {
    UNKNOWN_FIELD: 'Unknow input field: ',
    ON_ERROR: 'invalid',
    VALID: 'valid',
    PATTERTNS: {
      FIRST_NAME:
        'Latin/Cyrillic, first letter is capital, no spaces and no numbers, only - is allowed',
      SECOND_NAME:
        'Latin or Cyrillic, the first letter must be capital, no spaces and no numbers, only a hyphen is allowed',
      LOGIN: '3-20 Latin char, no spaces, hyphens and underscores are allowed',
      DISPLAY_NAME: 'Must be not empty',
      OLD_PASSWORD:
        '8 to 40 characters, at least one uppercase letter and number required',
      CONFIRM_PASSWORD:
        '8 to 40 characters, at least one uppercase letter and number required',
      NEW_PASSWORD:
        '8 to 40 characters, at least one uppercase letter and number required',
      PASSWORD:
        '8 to 40 characters, at least one uppercase letter and number required',
      EMAIL: 'Enter valid e-mail',
      PHONE: '10 to 15 characters, consists of numbers, may start with +',
      MESSAGE: 'Must be not empty',
    },
  },
};
export const PLACEHOLDER: { [x: string]: string } = {
  first_name: 'First&#160;name',
  second_name: 'Second&#160;name',
  display_name: 'Display&#160;name',
  login: 'login',
  email: 'E-mail',
  old_password: 'Old&#160;password',
  new_password: 'New&#160;password',
  phone: 'Phone',
  password: 'Password',
  password_confirm: 'Confirm&#160;password',
};

export const PATTERTNS: { [x: string]: string } = {
  FIRST_NAME:
    'Latin or Cyrillic, the first letter must be capital, no spaces and no numbers, only a hyphen is allowed',
  SECOND_NAME:
    'Latin or Cyrillic, the first letter must be capital, no spaces and no numbers, only a hyphen is allowed',
  LOGIN: '3-20 Latin char, no spaces, - and _ are allowed',
  DISPLAY_NAME: 'Must be not empty',
  OLD_PASSWORD:
    '8 to 40 characters, at least one uppercase letter and number required',
  NEW_PASSWORD:
    '8 to 40 characters, at least one uppercase letter and number required',
  PASSWORD: '8 to 40 characters, at least one Big letter and number',
  PASSWORD_CONFIRM:
    '8 to 40 characters, at least one uppercase letter and number required',
  EMAIL: 'Enter valid e-mail',
  PHONE: '10 to 15 characters, consists of numbers, may start with a plus',
  MESSAGE: 'Must be not empty',
};
