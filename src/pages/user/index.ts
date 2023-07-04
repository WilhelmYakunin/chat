import render from '../../components/render';
import profileIcon from '../../components/profile';
import createForm from '../../components/form';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import btn from '../../components/button';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';
import { getImageUrl } from '../../components/helpers';

import { words, PATTERTNS } from '../../langs/index';
import { routes } from '../../routes';

import { userInfoFields } from './model';
import validateFormValues from '../../components/helpers/validate';
import { userFormSchema } from './service';

import './style.scss';
import bem from 'bem-ts';

const block = bem('user');

const userPage = () => {
  const avatar = profileIcon({
    iconLink: getImageUrl('/pictures/test_ico.png'),
  });
  avatar.className = block('avatar');

  const changeAvatarLabel = label({ forAttr: userInfoFields.avatar });
  const changeAvatarInput = textInput({
    name: userInfoFields.avatar,
    type: 'file',
  });
  changeAvatarLabel.textContent = words.CHANGE_AVATAR;
  changeAvatarInput.multiple = true;
  changeAvatarInput.accept = 'imgae/png';
  changeAvatarLabel.className = block('inputChangeAvatar');
  changeAvatarLabel.appendChild(avatar);
  changeAvatarLabel.appendChild(changeAvatarInput);

  const header = document.createElement('h2');
  header.textContent = words.PROFILE;
  header.className = block('header');

  const changeAvatar = document.createElement('div');
  changeAvatar.className = block('changeAvatarWrapper');
  changeAvatar.appendChild(header);
  changeAvatar.appendChild(changeAvatarLabel);

  const headerContainer = document.createElement('div');
  headerContainer.className = block('headerContainer');
  headerContainer.appendChild(avatar);
  headerContainer.appendChild(changeAvatar);

  const firstNameLabel = label({ forAttr: userInfoFields.first_name });
  firstNameLabel.className = block('label');
  const firstNameInput = textInput({
    name: userInfoFields.first_name,
    type: 'text',
    placeHolder: words.FIRST_NAME,
  });
  firstNameInput.className = block('input');
  firstNameInput.tabIndex = 1;
  firstNameLabel.appendChild(firstNameInput);

  const secondNameLabel = label({ forAttr: userInfoFields.second_name });
  secondNameLabel.className = block('label');
  const secondNameInput = textInput({
    name: userInfoFields.second_name,
    type: 'text',
    placeHolder: words.SECOND_NAME,
  });
  secondNameInput.className = block('input');
  secondNameLabel.appendChild(secondNameInput);

  const displyNameLabel = label({ forAttr: userInfoFields.display_name });
  displyNameLabel.className = block('label');
  const displyNameInput = textInput({
    name: userInfoFields.display_name,
    type: 'text',
    placeHolder: words.DISPLAY_NAME,
  });
  displyNameInput.className = block('input');
  displyNameLabel.appendChild(displyNameInput);

  const loginLabel = label({ forAttr: userInfoFields.login });
  const loginInput = textInput({
    name: userInfoFields.login,
    type: 'text',
    placeHolder: words.LOGIN_PLACEHOLDER,
  });
  loginInput.className = block('input');
  loginLabel.appendChild(loginInput);

  const emainLabel = label({ forAttr: userInfoFields.email });
  const emailInput = textInput({
    name: userInfoFields.email,
    type: 'email',
    placeHolder: words.EMAIL,
  });
  emailInput.className = block('input');
  emainLabel.appendChild(emailInput);

  const passwordLable = label({ forAttr: userInfoFields.old_password });
  const passwordInput = textInput({
    name: userInfoFields.old_password,
    type: 'password',
    placeHolder: words.OLD_PASSWORD,
  });
  passwordInput.className = block('input');
  passwordLable.appendChild(passwordInput);

  const confirmPasswordLable = label({ forAttr: userInfoFields.new_password });
  const confirmPasswordInput = textInput({
    name: userInfoFields.new_password,
    type: 'confirm-password',
    placeHolder: words.NEW_PASSWORD,
  });
  confirmPasswordInput.className = block('input');
  confirmPasswordLable.appendChild(confirmPasswordInput);

  const phoneLabel = label({ forAttr: userInfoFields.phone });
  const phoneInput = textInput({
    name: userInfoFields.phone,
    type: 'phone',
    placeHolder: words.PHONE,
  });
  phoneInput.className = block('input');
  phoneLabel.appendChild(phoneInput);

  const policyLabel = label({ forAttr: userInfoFields.policy });
  policyLabel.className = block('policyLabel');
  policyLabel.textContent = words.CONFIRM_POLICY;
  const policyInput = checkbox({
    name: userInfoFields.policy,
    id: userInfoFields.policy,
  });
  policyInput.className = block('policyInput');
  const policyLink = textLink({ href: routes.policy(), text: words.PRIVACY });
  policyLink.className = block('policyLink');

  const policyWrapper = document.createElement('div');
  policyWrapper.className = block('policy');
  policyWrapper.appendChild(policyInput);
  policyWrapper.appendChild(policyLabel);
  policyWrapper.appendChild(policyLink);

  const applyChangesBtn = btn({ value: words.APPLY_CHANGES, type: 'submit' });
  applyChangesBtn.className = block('applyChangesButton');

  const back = textLink({ href: document.referrer, text: words.TO_HOME });
  back.className = block('backNavigate');

  const container = document.createElement('div');
  container.appendChild(back);

  [
    firstNameInput,
    secondNameInput,
    loginInput,
    displyNameInput,
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
      const data = Object.fromEntries(new FormData(userForm));
      const validation = validateFormValues(userFormSchema, data);
      Object.keys(validation).forEach((key) => {
        if (validation[key].check === words.VALIDATION.ON_ERROR) {
          const invalid = block('input', {
            [words.VALIDATION.ON_ERROR]: true,
          });
          userForm[key].parentElement.children[1].className = block('pattern', {
            shown: true,
          });
          return (userForm[key].className = invalid);
        }

        userForm[key].parentElement.children[1].className = block('pattern');
        return (userForm[key].className = block('input'));
      });
    });
  });

  const userForm = createForm({
    chidlren: [
      firstNameLabel,
      secondNameLabel,
      displyNameLabel,
      loginLabel,
      emainLabel,
      passwordLable,
      confirmPasswordLable,
      phoneLabel,
      policyWrapper,
      applyChangesBtn,
      back,
    ],
  });
  userForm.className = block('wrapper');
  userForm.addEventListener('submit', async (e): Promise<void> => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(userForm));
    const validation = validateFormValues(userFormSchema, data);
    Object.keys(validation).forEach((key) => {
      if (validation[key].check === words.VALIDATION.ON_ERROR) {
        const invalid = block('input', {
          [words.VALIDATION.ON_ERROR]: true,
        });
        userForm[key].parentElement.children[1].className = block('pattern', {
          shown: true,
        });
        return (userForm[key].className = invalid);
      }

      userForm[key].parentElement.children[1].className = block('pattern');
      return (userForm[key].className = block('input'));
    });

    console.log(data);
  });

  const userProfileContainer = document.createElement('div');
  userProfileContainer.appendChild(headerContainer);
  userProfileContainer.appendChild(userForm);

  return render(userProfileContainer);
};

export default userPage;
