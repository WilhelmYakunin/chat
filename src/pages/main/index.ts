import render from '../../components/render';
import profileIcon from '../../components/profile';
import textInput from '../../components/textInput';
import submitBtn from '../../components/button';
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

const mainPage = () => {
  const chatContainer = document.createElement('div');
  chatContainer.className = block();

  const board = document.createElement('section');
  board.className = block('board');

  const controls = document.createElement('div');
  controls.className = block('controls');

  const avatar = profileIcon({
    iconLink: getImageUrl('/pictures/test_ico.png'),
  });
  avatar.className = block('avatar');
  const chatsHeader = document.createElement('h2');
  chatsHeader.className = block('chatsHeader');
  chatsHeader.textContent = words.CHATS_HEADER;
  const addChat = submitBtn({ value: '+', type: 'button' });
  addChat.className = block('addTree');
  const addChatSection = document.createElement('div');
  addChatSection.className = block('addChat');
  addChatSection.appendChild(avatar);
  addChatSection.appendChild(chatsHeader);
  addChatSection.appendChild(addChat);
  const serch = textInput({
    name: 'serach',
    type: 'text',
    placeHolder: words.SEARCH_PLACEHOLDER,
  });
  serch.className = block('search');
  controls.appendChild(addChatSection);
  controls.appendChild(serch);

  const chatList = document.createElement('div');
  chatList.className = block('chatList');
  board.appendChild(controls);
  board.appendChild(chatList);

  const appControls = document.createElement('div');
  appControls.className = block('appControls');
  const showChats = document.createElement('span');
  showChats.className = block('appControlSetter', { pressed: true });
  const chatsIcon = document.createElement('img');
  chatsIcon.src = getImageUrl('/pictures/envelope.svg');
  showChats.appendChild(chatsIcon);
  appControls.appendChild(showChats);

  const showBanList = document.createElement('span');
  showBanList.className = block('appControlSetter');
  const banListIcon = document.createElement('img');
  banListIcon.src = getImageUrl('/pictures/pirate.svg');
  showBanList.appendChild(banListIcon);
  appControls.appendChild(showBanList);

  const showCamera = document.createElement('span');
  showCamera.className = block('appControlSetter');
  const cameraIcon = document.createElement('img');
  cameraIcon.src = getImageUrl('/pictures/camera.svg');
  showCamera.appendChild(cameraIcon);
  appControls.appendChild(showCamera);

  const showSettings = document.createElement('span');
  showSettings.className = block('appControlSetter');
  const settngsIcon = document.createElement('img');
  settngsIcon.src = getImageUrl('/pictures/settings.svg');
  showSettings.appendChild(settngsIcon);
  appControls.appendChild(showSettings);

  board.appendChild(appControls);

  chatContainer.appendChild(board);

  const chatBox = document.createElement('section');
  chatBox.className = block('chatBox');

  const chat = document.createElement('article');
  chat.innerHTML = '<p>no message here</p>';
  chatBox.appendChild(chat);

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
  }).getContent();

  chatBox.appendChild(messageForm);

  chatContainer.appendChild(chatBox);

  return render(chatContainer);
};

export default mainPage;
