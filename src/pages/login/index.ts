import render from '../../components/render';
import createForm from '../../components/form';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import btn from '../../components/button';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';

import { words } from '../../langs/index';
import { routes } from '../../routes';

import './style.scss';

const bemElem = (bem: string) => 'login-form' + '__' + bem;

const loginPage = () => {
  const header = document.createElement('h2');
  header.textContent = words.SIGN_IN;
  header.className = bemElem('header');

  const loginLabel = label({ forAttr: 'login' });
  const loginInput = textInput({
    name: 'login',
    type: 'text',
    placeHolder: words.LOGIN_PLACEHOLDER,
  });
  loginInput.className = bemElem('input');
  loginInput.tabIndex = 1;
  loginLabel.appendChild(loginInput);

  const passwordLable = label({ forAttr: 'password' });
  const passwordInput = textInput({
    name: 'password',
    type: 'password',
    placeHolder: words.PASSWORD_PLACEHOLDER,
  });
  passwordInput.className = bemElem('input');
  passwordLable.appendChild(passwordInput);

  const remeberLabel = label({ forAttr: 'remember' });
  remeberLabel.className = bemElem('remembre-label');
  remeberLabel.textContent = words.REMEMBER;
  const remebreInput = checkbox({ name: 'remember', id: 'remember' });
  remebreInput.className = bemElem('remebre-input');
  const rememebrWrapper = document.createElement('div');
  rememebrWrapper.className = bemElem('remember');
  rememebrWrapper.appendChild(remebreInput);
  rememebrWrapper.appendChild(remeberLabel);

  const remeberContainer = document.createElement('div');
  const forgotLink = textLink({ href: routes.forgot(), text: words.FORGOT });
  forgotLink.className = bemElem('forgot-link');

  remeberContainer.appendChild(rememebrWrapper);
  remeberContainer.appendChild(forgotLink);
  remeberContainer.className = bemElem('remember-container');

  const signInBtn = btn({ value: words.SIGN_IN, type: 'submit' });
  signInBtn.className = bemElem('auth-button');

  const loginForm = createForm({
    chidlren: [header, loginLabel, passwordLable, remeberContainer, signInBtn],
  });
  loginForm.className = bemElem('wrapper');

  const loginAside = document.createElement('aside');
  loginAside.className = bemElem('aside');
  const noaccount = document.createElement('span');
  noaccount.textContent = words.NO_ACCOUNT;
  const singupLink = textLink({ href: routes.singup(), text: words.SIGN_UP });
  singupLink.className = bemElem('signup-link');
  loginAside.appendChild(noaccount);
  loginAside.appendChild(singupLink);

  const loginContainer = document.createElement('div');
  loginContainer.appendChild(loginForm);
  loginContainer.appendChild(loginAside);

  loginForm.addEventListener('submit', async (e): Promise<void> => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm));
    console.log(data);
  });
  return render(loginContainer);
};

export default loginPage;
