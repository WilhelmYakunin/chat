import render from '../../components/render';
import profileIcon from '../../components/profile';
import createForm from '../../components/form';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import btn from '../../components/button';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';
import { getImageUrl } from '../../components/helpers';

import { words } from '../../langs/index';
import { routes } from '../../routes';

import { userInfoFields } from './model';

import './style.scss';

const bemElem = (bem: string) => 'user' + '__' + bem;

const userPage = () => {
  const avatar = profileIcon({
    iconLink: getImageUrl('/pictures/test_ico.png'),
  });
  avatar.className = bemElem('avatar');

  const changeAvatarLabel = label({ forAttr: userInfoFields.avatar });
  const changeAvatarInput = textInput({
    name: userInfoFields.avatar,
    type: 'file',
  });
  changeAvatarLabel.textContent = words.CHANGE_AVATAR;
  changeAvatarInput.multiple = true;
  changeAvatarInput.accept = 'imgae/png';
  changeAvatarLabel.className = bemElem('input-change-avatar');
  changeAvatarLabel.appendChild(avatar);
  changeAvatarLabel.appendChild(changeAvatarInput);

  const header = document.createElement('h2');
  header.textContent = words.PROFILE;
  header.className = bemElem('header');

  const changeAvatar = document.createElement('div');
  changeAvatar.className = bemElem('change-avatar-wrapper');
  changeAvatar.appendChild(header);
  changeAvatar.appendChild(changeAvatarLabel);

  const headerContainer = document.createElement('div');
  headerContainer.className = bemElem('header-container');
  headerContainer.appendChild(avatar);
  headerContainer.appendChild(changeAvatar);

  const firstNameLabel = label({ forAttr: userInfoFields.first_name });
  const firstNameInput = textInput({
    name: userInfoFields.first_name,
    type: 'text',
    placeHolder: words.FIRST_NAME,
  });
  firstNameInput.className = bemElem('input-name');
  firstNameInput.tabIndex = 1;
  firstNameLabel.appendChild(firstNameInput);

  const secondNameLabel = label({ forAttr: userInfoFields.second_name });
  const secondNameInput = textInput({
    name: userInfoFields.second_name,
    type: 'text',
    placeHolder: words.SECOND_NAME,
  });
  secondNameInput.className = bemElem('input-name');
  secondNameLabel.appendChild(secondNameInput);

  const userNameContainer = document.createElement('div');
  userNameContainer.className = bemElem('username-container');
  userNameContainer.appendChild(firstNameLabel);
  userNameContainer.appendChild(secondNameLabel);

  const displyNameLabel = label({ forAttr: userInfoFields.display_name });
  const displyNameInput = textInput({
    name: userInfoFields.display_name,
    type: 'text',
    placeHolder: words.DISPLAY_NAME,
  });
  displyNameInput.className = bemElem('input');
  displyNameLabel.appendChild(displyNameInput);

  const loginLabel = label({ forAttr: userInfoFields.login });
  const loginInput = textInput({
    name: userInfoFields.login,
    type: 'text',
    placeHolder: words.LOGIN_PLACEHOLDER,
  });
  loginInput.className = bemElem('input');
  loginLabel.appendChild(loginInput);

  const emainLabel = label({ forAttr: userInfoFields.email });
  const emailInput = textInput({
    name: userInfoFields.email,
    type: 'email',
    placeHolder: words.EMAIL,
  });
  emailInput.className = bemElem('input');
  emainLabel.appendChild(emailInput);

  const passwordLable = label({ forAttr: userInfoFields.old_password });
  const passwordInput = textInput({
    name: userInfoFields.old_password,
    type: 'password',
    placeHolder: words.OLD_PASSWORD,
  });
  passwordInput.className = bemElem('input');
  passwordLable.appendChild(passwordInput);

  const confirmPasswordLable = label({ forAttr: userInfoFields.new_password });
  const confirmPasswordInput = textInput({
    name: userInfoFields.new_password,
    type: 'confirm-password',
    placeHolder: words.NEW_PASSWORD,
  });
  confirmPasswordInput.className = bemElem('input');
  confirmPasswordLable.appendChild(confirmPasswordInput);

  const phoneLabel = label({ forAttr: userInfoFields.phone });
  const phoneInput = textInput({
    name: userInfoFields.phone,
    type: 'phone',
    placeHolder: words.PHONE,
  });
  phoneInput.className = bemElem('input');
  phoneLabel.appendChild(phoneInput);

  const policyLabel = label({ forAttr: userInfoFields.policy });
  policyLabel.className = bemElem('policy-label');
  policyLabel.textContent = words.CONFIRM_POLICY;
  const policyInput = checkbox({
    name: userInfoFields.policy,
    id: userInfoFields.policy,
  });
  policyInput.className = bemElem('policy-input');
  const policyLink = textLink({ href: routes.policy(), text: words.PRIVACY });
  policyLink.className = bemElem('policy-link');

  const policyWrapper = document.createElement('div');
  policyWrapper.className = bemElem('policy');
  policyWrapper.appendChild(policyInput);
  policyWrapper.appendChild(policyLabel);
  policyWrapper.appendChild(policyLink);

  const applyChangesBtn = btn({ value: words.APPLY_CHANGES, type: 'button' });
  applyChangesBtn.className = bemElem('apply-changes-button');

  const back = textLink({ href: document.referrer, text: words.TO_HOME });
  back.className = bemElem('back-navigate');

  const container = document.createElement('div');
  container.appendChild(back);

  const siginupForm = createForm({
    chidlren: [
      userNameContainer,
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
  siginupForm.className = bemElem('wrapper');

  const userProfileContainer = document.createElement('div');
  userProfileContainer.appendChild(headerContainer);
  userProfileContainer.appendChild(siginupForm);

  return render(userProfileContainer);
};

export default userPage;
