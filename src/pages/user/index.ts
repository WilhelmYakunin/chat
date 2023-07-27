import { getImageUrl } from '../../components/helpers';

import { words, PATTERTNS, PLACEHOLDER } from '../../langs/index';

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
  const avatar = new Block('div', {
    template: `<div class={{class}}>
    <img alt='user depiction' src={{iconlink}}></img>
    </div>`,
    data: {
      class: block('avatar'),
      iconlink: getImageUrl('/pictures/test_ico.png'),
    },
  });

  const changeAvatarLabel = new Block('label', {
    template: `<label for={{forAttr}} class={{class}}>
    {{{label}}}
      <input class={{inutclass}} type='file' accept='imgae/png' multiple name='avatar'></input> 
    </label>`,
    data: {
      forAttr: 'avatar',
      label: words.CHANGE_AVATAR,
      class: block('inputChangeAvatar'),
    },
  });

  const header = new Block('h2', {
    template: '<h2 class={{class}}>{{text}}</h2>',
    data: { class: block('header'), text: words.PROFILE },
  });

  const changeAvatar = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('changeAvatarWrapper') },
    children: [header, changeAvatarLabel],
  });

  const headerContainer = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('headerContainer') },
    children: [avatar, changeAvatar],
  });

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
  });

  const userProfileContainer = new Block('div', {
    children: [headerContainer, userForm],
  });

  return userProfileContainer;
};

export default userPage;
