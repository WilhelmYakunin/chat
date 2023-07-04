import render from '../../components/render';
import createForm from '../../components/form';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import btn from '../../components/button';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';

import { words, PATTERTNS } from '../../langs/index';
import { routes } from '../../routes';

import { signupFields } from './model';
import validateFormValues from '../../components/helpers/validate';

import './style.scss';
import bem from 'bem-ts';
import { signupFormSchema } from './service';

const block = bem('signup');

const siginupPage = () => {
  const header = document.createElement('h2');
  header.textContent = words.SIGN_UP;
  header.className = block('header');

  const firstNameLabel = label({ forAttr: signupFields.first_name });
  const firstNameInput = textInput({
    name: signupFields.first_name,
    type: 'text',
    placeHolder: words.FIRST_NAME,
  });
  firstNameInput.className = block('input');
  firstNameInput.tabIndex = 1;
  firstNameLabel.appendChild(firstNameInput);

  const secondNameLabel = label({ forAttr: signupFields.second_name });
  const secondNameInput = textInput({
    name: signupFields.second_name,
    type: 'text',
    placeHolder: words.SECOND_NAME,
  });
  secondNameInput.className = block('input');
  secondNameLabel.appendChild(secondNameInput);

  const loginLabel = label({ forAttr: signupFields.login });
  const loginInput = textInput({
    name: signupFields.login,
    type: 'text',
    placeHolder: words.LOGIN_PLACEHOLDER,
  });
  loginInput.className = block('input');
  loginLabel.appendChild(loginInput);

  const emainLabel = label({ forAttr: signupFields.email });
  const emailInput = textInput({
    name: signupFields.email,
    type: 'email',
    placeHolder: words.EMAIL,
  });
  emailInput.className = block('input');
  emainLabel.appendChild(emailInput);

  const passwordLable = label({ forAttr: signupFields.password });
  const passwordInput = textInput({
    name: signupFields.password,
    type: 'password',
    placeHolder: words.PASSWORD_PLACEHOLDER,
  });
  passwordInput.className = block('input');
  passwordLable.appendChild(passwordInput);

  const confirmPasswordLable = label({
    forAttr: signupFields.password_confirm,
  });
  const confirmPasswordInput = textInput({
    name: signupFields.password_confirm,
    type: 'password',
    placeHolder: words.CONFIRM_PASSWORD,
  });
  confirmPasswordInput.className = block('input');
  confirmPasswordLable.appendChild(confirmPasswordInput);

  const phoneLabel = label({ forAttr: signupFields.phone });
  const phoneInput = textInput({
    name: signupFields.phone,
    type: 'phone',
    placeHolder: words.PHONE,
  });
  phoneInput.className = block('input');
  phoneLabel.appendChild(phoneInput);

  const policyLabel = label({ forAttr: signupFields.policy });
  policyLabel.className = block('policyLabel');
  policyLabel.textContent = words.CONFIRM_POLICY;
  const policyInput = checkbox({
    name: signupFields.policy,
    id: signupFields.policy,
  });
  policyInput.className = block('policyInput');
  const policyLink = textLink({ href: routes.policy(), text: words.PRIVACY });
  policyLink.className = block('policyLink');

  const policyWrapper = document.createElement('div');
  policyWrapper.className = block('policy');
  policyWrapper.appendChild(policyInput);
  policyWrapper.appendChild(policyLabel);
  policyWrapper.appendChild(policyLink);

  const signUpBtn = btn({ value: words.SIGN_UP, type: 'submit' });
  signUpBtn.className = block('authButton');

  [
    firstNameInput,
    secondNameInput,
    loginInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    phoneInput,
  ].forEach((el) => {
    if (el.parentElement) {
      const pattern = document.createElement('span');
      pattern.className = block('pattern');
      pattern.textContent = PATTERTNS[el.name.toUpperCase()];
      el.parentElement.className = block('label');
      el.parentElement.appendChild(pattern);
    }

    el.addEventListener('blur', (e): void => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(siginupForm));
      const validation = validateFormValues(signupFormSchema, data);
      Object.keys(validation).forEach((key) => {
        if (validation[key].check === words.VALIDATION.ON_ERROR) {
          const invalid = block('input', {
            [words.VALIDATION.ON_ERROR]: true,
          });
          siginupForm[key].parentElement.children[1].className = block(
            'pattern',
            {
              shown: true,
            }
          );
          return (siginupForm[key].className = invalid);
        }

        siginupForm[key].parentElement.children[1].className = block('pattern');
        return (siginupForm[key].className = block('input'));
      });
    });
  });

  const siginupForm = createForm({
    chidlren: [
      header,
      firstNameLabel,
      secondNameLabel,
      loginLabel,
      emainLabel,
      passwordLable,
      confirmPasswordLable,
      phoneLabel,
      policyWrapper,
      signUpBtn,
    ],
  });
  siginupForm.className = block('wrapper');
  siginupForm.addEventListener('submit', async (e): Promise<void> => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(siginupForm));
    const validation = validateFormValues(signupFormSchema, data);
    Object.keys(validation).forEach((key) => {
      if (validation[key].check === words.VALIDATION.ON_ERROR) {
        const invalid = block('input', {
          [words.VALIDATION.ON_ERROR]: true,
        });
        siginupForm[key].parentElement.children[1].className = block(
          'pattern',
          {
            shown: true,
          }
        );
        return (siginupForm[key].className = invalid);
      }

      siginupForm[key].parentElement.children[1].className = block('pattern');
      return (siginupForm[key].className = block('input'));
    });

    console.log(data);
  });

  const signuoAside = document.createElement('aside');
  signuoAside.className = block('aside');
  const isaccount = document.createElement('span');
  isaccount.textContent = words.IS_ACCOUNT;
  const singinLink = textLink({ href: routes.login(), text: words.SIGN_IN });
  singinLink.className = block('signinLink');
  signuoAside.appendChild(isaccount);
  signuoAside.appendChild(singinLink);

  const loginContainer = document.createElement('div');
  loginContainer.appendChild(siginupForm);
  loginContainer.appendChild(signuoAside);

  return render(loginContainer);
};

export default siginupPage;
