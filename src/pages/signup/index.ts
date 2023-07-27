import { words, PATTERTNS, PLACEHOLDER } from '../../langs/index';
import { routes } from '../../router/routes';

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

  const signUpBtn = new Block('input', {
    template: submitBtnTemplate,
    data: {
      type: 'submit',
      class: block('authButton'),
      value: words.SIGN_UP,
    },
  });

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
  });

  const signuoAside = new Block('aside', {
    template: `<aside class={{class}}>
      <span>{{{text}}}</span>
      <a class={{linkclass}} href={{linkhref}}>{{{textlink}}}</a>
      </aside>`,
    data: {
      class: block('aside'),
      text: words.IS_ACCOUNT,
      linkclass: block('signinLink'),
      textlink: words.SIGN_IN,
      linkhref: routes.login(),
    },
  });

  const loginContainer = new Block('div', {
    children: [siginupForm, signuoAside],
  });

  return loginContainer;
};

export default siginupPage;
