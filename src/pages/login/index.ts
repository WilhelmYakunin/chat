import render from '../../components/render';
import createForm from '../../components/form';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import btn from '../../components/button';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';

import { words, PATTERTNS } from '../../langs/index';
import { routes } from '../../routes';

import { loginFields } from './model';

import validateFormValues from '../../components/helpers/validate';
import { loginFormSchema } from './service';

import './style.scss';
import bem from 'bem-ts';

const block = bem('login');

const loginPage = () => {
  const header = document.createElement('h2');
  header.textContent = words.SIGN_IN;
  header.className = block('header');

  const loginLabel = label({ forAttr: loginFields.login });
  const loginInput = textInput({
    name: loginFields.login,
    type: 'text',
    placeHolder: words.LOGIN_PLACEHOLDER,
  });
  loginInput.className = block('input');
  loginInput.tabIndex = 1;
  loginLabel.appendChild(loginInput);

  const passwordLable = label({ forAttr: loginFields.password });
  const passwordInput = textInput({
    name: loginFields.password,
    type: 'password',
    placeHolder: words.PASSWORD_PLACEHOLDER,
  });
  passwordInput.className = block('input');
  passwordLable.appendChild(passwordInput);

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

  const signInBtn = btn({ value: words.SIGN_IN, type: 'submit' });
  signInBtn.className = block('authButton');

  const loginForm = createForm({
    chidlren: [header, loginLabel, passwordLable, remeberContainer, signInBtn],
  });

  [loginInput, passwordInput].forEach((el) => {
    if (el.parentElement) {
      const pattern = document.createElement('span');
      pattern.className = block('pattern');
      pattern.textContent = PATTERTNS[el.name.toUpperCase()];
      el.parentElement.className = block('label');
      el.parentElement.appendChild(pattern);
    }

    el.addEventListener('blur', (e): void => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm));
      const validation = validateFormValues(loginFormSchema, data);
      Object.keys(validation).forEach((key) => {
        if (validation[key].check === words.VALIDATION.ON_ERROR) {
          const invalid = block('input', {
            [words.VALIDATION.ON_ERROR]: true,
          });
          loginForm[key].parentElement.children[1].className = block(
            'pattern',
            {
              shown: true,
            }
          );
          return (loginForm[key].className = invalid);
        }

        loginForm[key].parentElement.children[1].className = block('pattern');
        return (loginForm[key].className = block('input'));
      });
    });
  });

  loginForm.className = block('wrapper');
  loginForm.addEventListener('submit', (e): void => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm));
    const validation = validateFormValues(loginFormSchema, data);
    Object.keys(validation).forEach((key) => {
      if (validation[key].check === words.VALIDATION.ON_ERROR) {
        const invalid = block('input', {
          [words.VALIDATION.ON_ERROR]: true,
        });
        loginForm[key].parentElement.children[1].className = block('pattern', {
          shown: true,
        });
        return (loginForm[key].className = invalid);
      }

      loginForm[key].parentElement.children[1].className = block('pattern');
      return (loginForm[key].className = block('input'));
    });

    console.log(data);
  });

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
