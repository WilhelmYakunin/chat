import render from '../../components/render';
import createForm from '../../components/form';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import btn from '../../components/button';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';

import { words } from '../../langs/index';
import { routes } from '../../routes';

import { SignupFields } from './model';

import './style.scss';

const bemElem = (bem: string) => 'signup-form' + '__' + bem;

const siginupPage = () => {
  const header = document.createElement('h2');
  header.textContent = words.SIGN_UP;
  header.className = bemElem('header');

  const firstNameLabel = label({ forAttr: SignupFields.first_name });
  const firstNameInput = textInput({
    name: SignupFields.first_name,
    type: 'text',
    placeHolder: words.FIRST_NAME,
  });
  firstNameInput.className = bemElem('input-name');
  firstNameInput.tabIndex = 1;
  firstNameLabel.appendChild(firstNameInput);

  const secondNameLabel = label({ forAttr: SignupFields.second_name });
  const secondNameInput = textInput({
    name: SignupFields.second_name,
    type: 'text',
    placeHolder: words.SECOND_NAME,
  });
  secondNameInput.className = bemElem('input-name');
  secondNameLabel.appendChild(secondNameInput);

  const userNameContainer = document.createElement('div');
  userNameContainer.className = bemElem('username-container');
  userNameContainer.appendChild(firstNameLabel);
  userNameContainer.appendChild(secondNameLabel);

  const loginLabel = label({ forAttr: SignupFields.login });
  const loginInput = textInput({
    name: SignupFields.login,
    type: 'text',
    placeHolder: words.LOGIN_PLACEHOLDER,
  });
  loginInput.className = bemElem('input');
  loginLabel.appendChild(loginInput);

  const emainLabel = label({ forAttr: SignupFields.email });
  const emailInput = textInput({
    name: SignupFields.email,
    type: 'email',
    placeHolder: words.EMAIL,
  });
  emailInput.className = bemElem('input');
  emainLabel.appendChild(emailInput);

  const passwordLable = label({ forAttr: SignupFields.password });
  const passwordInput = textInput({
    name: SignupFields.password,
    type: 'password',
    placeHolder: words.PASSWORD_PLACEHOLDER,
  });
  passwordInput.className = bemElem('input');
  passwordLable.appendChild(passwordInput);

  const confirmPasswordLable = label({
    forAttr: SignupFields.password_confirm,
  });
  const confirmPasswordInput = textInput({
    name: SignupFields.password_confirm,
    type: 'password',
    placeHolder: words.CONFIRM_PASSWORD,
  });
  confirmPasswordInput.className = bemElem('input');
  confirmPasswordLable.appendChild(confirmPasswordInput);

  const phoneLabel = label({ forAttr: SignupFields.phone });
  const phoneInput = textInput({
    name: SignupFields.phone,
    type: 'phone',
    placeHolder: words.PHONE,
  });
  phoneInput.className = bemElem('input');
  phoneLabel.appendChild(phoneInput);

  const policyLabel = label({ forAttr: SignupFields.policy });
  policyLabel.className = bemElem('policy-label');
  policyLabel.textContent = words.CONFIRM_POLICY;
  const policyInput = checkbox({
    name: SignupFields.policy,
    id: SignupFields.policy,
  });
  policyInput.className = bemElem('policy-input');
  const policyLink = textLink({ href: routes.policy(), text: words.PRIVACY });
  policyLink.className = bemElem('policy-link');

  const policyWrapper = document.createElement('div');
  policyWrapper.className = bemElem('policy');
  policyWrapper.appendChild(policyInput);
  policyWrapper.appendChild(policyLabel);
  policyWrapper.appendChild(policyLink);

  const signUpBtn = btn({ value: words.SIGN_UP, type: 'button' });
  signUpBtn.className = bemElem('auth-button');

  const siginupForm = createForm({
    chidlren: [
      header,
      userNameContainer,
      loginLabel,
      emainLabel,
      passwordLable,
      confirmPasswordLable,
      phoneLabel,
      policyWrapper,
      signUpBtn,
    ],
  });
  siginupForm.className = bemElem('wrapper');
  siginupForm.addEventListener('submit', async (e): Promise<void> => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(siginupForm));
    console.log(data);
  });

  const signuoAside = document.createElement('aside');
  signuoAside.className = bemElem('aside');
  const isaccount = document.createElement('span');
  isaccount.textContent = words.IS_ACCOUNT;
  const singinLink = textLink({ href: routes.login(), text: words.SIGN_IN });
  singinLink.className = bemElem('signin-link');
  signuoAside.appendChild(isaccount);
  signuoAside.appendChild(singinLink);

  const loginContainer = document.createElement('div');
  loginContainer.appendChild(siginupForm);
  loginContainer.appendChild(signuoAside);

  return render(loginContainer);
};

export default siginupPage;
