import render from '../../components/render';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import checkbox from '../../components/checkbox';
import textLink from '../../components/textLink';

import { words, PATTERTNS, PLACEHOLDER } from '../../langs/index';
import { routes } from '../../routes';

import { signupFields } from './model';
import { validateInput } from '../../components/helpers/validate';

import './style.scss';
import bem from 'bem-ts';
import { signupFormSchema } from './service';
import Block from '../../components/block';
import {
  formTemplate,
  headerTmeplate,
  inputTemplate,
  labelTemplate,
  patternTemplate,
  submitBtnTemplate,
} from './templates';
import { userInfoFields } from '../user/model';

const block = bem('signup');

const siginupPage = () => {
  const header = new Block('h2', {
    template: headerTmeplate,
    data: { text: words.SIGN_UP, class: block('header') },
  });

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

  const signUpBtn = new Block('input', {
    template: submitBtnTemplate,
    data: {
      type: 'submit',
      class: block('authButton'),
      value: words.APPLY_CHANGES,
    },
  });

  const fields = [header];

  for (const key in signupFormSchema) {
    const input = new Block('input', {
      template: inputTemplate,
      data: {
        name: signupFields[key as keyof typeof signupFields],
        class: block('input'),
        placeholder: PLACEHOLDER[key as keyof typeof signupFormSchema],
        tabIndex: key === 'first_name' && '1',
      },
      events: [
        {
          eventName: 'blur',
          callback: (e: Event) =>
            validateInput({
              target: e.target as HTMLElement,
              rule: signupFormSchema[key as keyof typeof userInfoFields]
                .pattern,
            }),
        },
      ],
    });

    const pattern = new Block('span', {
      template: patternTemplate,
      data: {
        class: block('pattern'),
        text: PATTERTNS[key.toUpperCase() as keyof typeof signupFormSchema],
      },
    });

    const lable = new Block('label', {
      template: labelTemplate,
      data: {
        forAttr: signupFields[key as keyof typeof signupFields],
        labelClass: block('label'),
      },
      children: [input, pattern],
    });

    fields.push(lable);
  }

  fields.push(signUpBtn);

  const siginupForm = new Block('form', {
    template: formTemplate,
    data: {
      class: block('wrapper'),
    },
    children: fields,
    events: [
      {
        eventName: 'submit',
        callback: (e: Event): void => {
          e.preventDefault();
          const data: { [x: string]: unknown } = {};
          for (const key in signupFormSchema) {
            const el = (e.target as HTMLFormElement).elements[
              key as keyof HTMLFormControlsCollection
            ];

            data[key] = (el as unknown as HTMLInputElement).value;
            validateInput({
              target: el as HTMLElement,
              rule: signupFormSchema[key].pattern,
            });
          }

          console.log(data);
        },
      },
    ],
  }).getContent();

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
