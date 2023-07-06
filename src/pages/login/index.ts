import render from '../../components/render';
import label from '../../components/labelTextInput';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';

import { words } from '../../langs/index';
import { routes } from '../../routes';

import { loginFields } from './model';

import { validateInput } from '../../components/helpers/validate';
import { loginFormSchema } from './service';

import './style.scss';
import bem from 'bem-ts';
import Block from '../../components/block';
import {
  formTemplate,
  headerTmeplate,
  inputTemplate,
  labelTemplate,
  patternTemplate,
  submitBtnTemplate,
} from './templates';

const block = bem('login');

const loginPage = () => {
  const header = new Block('h2', {
    template: headerTmeplate,
    data: { text: words.SIGN_IN, class: block('header') },
  });

  const loginINput = new Block('input', {
    template: inputTemplate,
    data: {
      name: loginFields.login,
      class: block('input'),
      placeholder: words.LOGIN_PLACEHOLDER,
      tabIndex: 1,
    },
    events: [
      {
        eventName: 'blur',
        callback: (e: Event) =>
          validateInput({
            target: e.target as HTMLElement,
            rule: loginFormSchema.login.pattern,
          }),
      },
    ],
  });

  const loginPattern = new Block('div', {
    template: patternTemplate,
    data: {
      class: block('pattern'),
      text: words.VALIDATION.PATTERTNS.LOGIN,
    },
  });

  const loginLabel = new Block('label', {
    template: labelTemplate,
    data: {
      forAttr: loginFields.login,
      labelClass: block('label'),
    },
    children: [loginINput, loginPattern],
  });

  const passwordInput = new Block('input', {
    template: inputTemplate,
    data: {
      name: loginFields.password,
      class: block('input'),
      placeholder: words.PASSWORD_PLACEHOLDER,
      tabIndex: 1,
    },
    events: [
      {
        eventName: 'blur',
        callback: (e: Event) =>
          validateInput({
            target: e.target as HTMLElement,
            rule: loginFormSchema.password.pattern,
          }),
      },
    ],
  });

  const passwordPattern = new Block('div', {
    template: patternTemplate,
    data: {
      class: block('pattern'),
      text: words.VALIDATION.PATTERTNS.LOGIN,
    },
  });

  const passwordLable = new Block('label', {
    template: labelTemplate,
    data: {
      forAttr: loginFields.password,
      labelClass: block('label'),
    },
    children: [passwordInput, passwordPattern],
  });

  const remeberLabel = label({ forAttr: loginFields.remember });
  remeberLabel.className = block('rememberLabel');
  remeberLabel.textContent = words.REMEMBER;
  const remebreInput = checkbox({
    name: loginFields.remember,
    id: loginFields.remember,
  });
  remebreInput.className = block('inputRemember');
  const rememebrWrapper = document.createElement('div');
  rememebrWrapper.className = block('rememberWrapper');
  rememebrWrapper.appendChild(remebreInput);
  rememebrWrapper.appendChild(remeberLabel);
  const remeberContainer = document.createElement('div');
  const forgotLink = textLink({ href: routes.forgot(), text: words.FORGOT });
  forgotLink.className = block('forgotLink');

  remeberContainer.appendChild(rememebrWrapper);
  remeberContainer.appendChild(forgotLink);
  remeberContainer.className = block('rememberContainer');

  const signInBtn = new Block('input', {
    template: submitBtnTemplate,
    data: { type: 'submit', class: block('authButton'), value: words.SIGN_IN },
  });

  const loginForm = new Block('form', {
    template: formTemplate,
    data: { class: block('wrapper') },
    children: [header, loginLabel, passwordLable, signInBtn],
    events: [
      {
        eventName: 'submit',
        callback: (e: Event): void => {
          e.preventDefault();
          const data: { [x: string]: unknown } = {};
          for (const key in loginFormSchema) {
            const el = (e.target as HTMLFormElement).elements[
              key as keyof HTMLFormControlsCollection
            ];
            data[key] = (el as unknown as HTMLInputElement).value;
            validateInput({
              target: el as HTMLElement,
              rule: loginFormSchema[key].pattern,
            });
          }

          console.log(data);
        },
      },
    ],
  }).getContent();

  const loginAside = document.createElement('aside');
  loginAside.className = block('aside');
  const noaccount = document.createElement('span');
  noaccount.textContent = words.NO_ACCOUNT;
  const singupLink = textLink({ href: routes.singup(), text: words.SIGN_UP });
  singupLink.className = block('signupLink');
  loginAside.appendChild(noaccount);
  loginAside.appendChild(singupLink);

  const loginContainer = document.createElement('div');
  loginContainer.appendChild(loginForm);
  loginContainer.appendChild(loginAside);

  return render(loginContainer);
};

export default loginPage;
