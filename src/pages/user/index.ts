import render from '../../components/render';
import profileIcon from '../../components/profile';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';
import { getImageUrl } from '../../components/helpers';

import { words, PATTERTNS, PLACEHOLDER } from '../../langs/index';
import { routes } from '../../routes';

import { userInfoFields } from './model';
import { validateInput } from '../../components/helpers/validate';
import { userFormSchema } from './service';

import './style.scss';
import bem from 'bem-ts';
import Block from '../../components/block';
import {
  formTemplate,
  inputTemplate,
  labelTemplate,
  patternTemplate,
  submitBtnTemplate,
} from './templates';

const block = bem('user');

const userPage = () => {
  const avatar = profileIcon({
    iconLink: getImageUrl('/pictures/test_ico.png'),
  });
  avatar.className = block('avatar');

  const changeAvatarLabel = label({ forAttr: 'avatar' });
  const changeAvatarInput = textInput({
    name: 'avatar',
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

  const policyLabel = label({ forAttr: 'policy' });
  policyLabel.className = block('policyLabel');
  policyLabel.textContent = words.CONFIRM_POLICY;
  const policyInput = checkbox({
    name: 'policy',
    id: 'policy',
  });
  policyInput.className = block('policyInput');
  const policyLink = textLink({ href: routes.policy(), text: words.PRIVACY });
  policyLink.className = block('policyLink');

  const policyWrapper = document.createElement('div');
  policyWrapper.className = block('policy');
  policyWrapper.appendChild(policyInput);
  policyWrapper.appendChild(policyLabel);
  policyWrapper.appendChild(policyLink);

  const back = textLink({ href: document.referrer, text: words.TO_HOME });
  back.className = block('backNavigate');

  const container = document.createElement('div');
  container.appendChild(back);

  const fields = [];
  for (const key in userInfoFields) {
    const input = new Block('input', {
      template: inputTemplate,
      data: {
        name: userInfoFields[key as keyof typeof userInfoFields],
        class: block('input'),
        placeholder: PLACEHOLDER[key as keyof typeof userInfoFields],
        tabIndex: key === 'first_name' && '1',
      },
      events: [
        {
          eventName: 'blur',
          callback: (e: Event) =>
            validateInput({
              target: e.target as HTMLElement,
              rule: userFormSchema[key as keyof typeof userInfoFields].pattern,
            }),
        },
      ],
    });

    const pattern = new Block('span', {
      template: patternTemplate,
      data: {
        class: block('pattern'),
        text: PATTERTNS[key.toUpperCase() as keyof typeof userInfoFields],
      },
    });

    const lable = new Block('label', {
      template: labelTemplate,
      data: {
        forAttr: userInfoFields[key as keyof typeof userInfoFields],
        labelClass: block('label'),
      },
      children: [input, pattern],
    });

    fields.push(lable);
  }

  const applyChangesBtn = new Block('input', {
    template: submitBtnTemplate,
    data: {
      type: 'submit',
      class: block('applyChangesButton'),
      value: words.APPLY_CHANGES,
    },
  });

  fields.push(applyChangesBtn);
  const userForm = new Block('form', {
    template: formTemplate,
    data: { class: block('wrapper') },
    children: fields,
    events: [
      {
        eventName: 'submit',
        callback: (e: Event): void => {
          e.preventDefault();
          const data: { [x: string]: unknown } = {};
          for (const key in userFormSchema) {
            const el = (e.target as HTMLFormElement).elements[
              key as keyof HTMLFormControlsCollection
            ];
            data[key] = (el as unknown as HTMLInputElement).value;
            validateInput({
              target: el as HTMLElement,
              rule: userFormSchema[key].pattern,
            });
          }

          console.log(data);
        },
      },
    ],
  }).getContent();

  const userProfileContainer = document.createElement('div');
  userProfileContainer.appendChild(headerContainer);
  userProfileContainer.appendChild(userForm);

  return render(userProfileContainer);
};

export default userPage;
