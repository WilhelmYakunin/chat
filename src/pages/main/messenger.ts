import { getImageUrl } from '../../components/helpers';

import { words } from '../../langs';
import { messageFileds } from './model';
import { validateInput } from '../../components/helpers/validate';
import { messageFormSchema } from './service';

import './style.scss';
import bem from 'bem-ts';
import Block from '../../components/block';
import {
  formTemplate,
  inputTemplate,
  labelTemplate,
  patternTemplate,
} from './templates';

const block = bem('chat');

const mainPage = (): Block => {
  const img = new Block('img', {
    template: "<img src={{icolink}} alt='user depiction'> </img>",
    data: { icolink: getImageUrl('/pictures/test_ico.png') },
  });

  const avatar = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('avatar') },
    children: [img],
  });

  const chatsHeader = new Block('h2', {
    template: '<h2 class={{class}}>{{{text}}}</h2>',
    data: {
      text: words.CHATS_HEADER,
      class: block('chatsHeader'),
    },
  });

  const addChat = new Block('button', {
    template: "<button type='button' class={{class}}>+</button>",
    data: { class: block('addTree') },
  });

  const addChatSection = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('addChat') },
    children: [avatar, chatsHeader, addChat],
  });

  const serch = new Block('input', {
    template:
      "<input name='search' class={{class}} type='text' placeholder={{{text}}}></input>",
    data: { text: words.SEARCH_PLACEHOLDER, class: block('search') },
  });

  const controls = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('controls') },
    children: [addChatSection, serch],
  });

  const chatList = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('chatList') },
  });

  const controlsTemplate =
    '<span class={{class}}><img alt={{alt}} src={{imglink}} /></span>';

  const showChats = new Block('span', {
    template: controlsTemplate,
    data: {
      class: block('appControlSetter', { pressed: true }).split(' ')[1],
      alt: 'showAllChats',
      imglink: getImageUrl('/pictures/envelope.svg'),
    },
  });

  const showBanList = new Block('span', {
    template: controlsTemplate,
    data: {
      class: block('appControlSetter'),
      alt: 'showAllChats',
      imglink: getImageUrl('/pictures/pirate.svg'),
    },
  });

  const showCamera = new Block('span', {
    template: controlsTemplate,
    data: {
      class: block('appControlSetter'),
      alt: 'showAllChats',
      imglink: getImageUrl('/pictures/camera.svg'),
    },
  });

  const showSettings = new Block('span', {
    template: controlsTemplate,
    data: {
      class: block('appControlSetter'),
      alt: 'showAllChats',
      imglink: getImageUrl('/pictures/settings.svg'),
    },
  });

  const chatControls = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block('appControls') },
    children: [showChats, showBanList, showCamera, showSettings],
  });

  const messageInput = new Block('input', {
    template: inputTemplate,
    data: {
      name: messageFileds.message,
      class: block('input'),
      placeholder: words.MESSAGE,
      tabIndex: 1,
    },
    events: [
      {
        eventName: 'blur',
        callback: (e: Event) =>
          validateInput({
            target: e.target as HTMLElement,
            rule: messageFormSchema.message.pattern,
          }),
      },
    ],
  });

  const messagePattern = new Block('div', {
    template: patternTemplate,
    data: {
      class: block('pattern'),
      text: words.VALIDATION.PATTERTNS.MESSAGE,
    },
  });

  const inputMessageLabel = new Block('label', {
    template: labelTemplate,
    data: {
      forAttr: messageFileds.message,
      labelClass: block('label'),
    },
    children: [messageInput, messagePattern],
  });

  const messageForm = new Block('form', {
    template: formTemplate,
    children: [inputMessageLabel],
    events: [
      {
        eventName: 'submit',
        callback: (e: Event): void => {
          e.preventDefault();
          const data: { [x: string]: unknown } = {};
          for (const key in messageFormSchema) {
            const el = (e.target as HTMLFormElement).elements[
              key as keyof HTMLFormControlsCollection
            ];
            data[key] = (el as unknown as HTMLInputElement).value;
            validateInput({
              target: el as HTMLElement,
              rule: messageFormSchema[key].pattern,
            });
          }

          console.log(data);
        },
      },
    ],
  });

  const chatBox = new Block('section', {
    template: '<section class={{class}}></section>',
    data: { class: block('chatBox') },
    children: [messageForm],
  });

  const board = new Block('section', {
    template: '<section class={{class}}></section>',
    data: { class: block('board') },
    children: [controls, chatList, chatControls],
  });

  const chatContainer = new Block('div', {
    template: '<div class={{class}}></div>',
    data: { class: block() },
    children: [board, chatBox],
  });

  return chatContainer;
};

export default mainPage;
