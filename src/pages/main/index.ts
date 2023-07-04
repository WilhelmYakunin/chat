import render from '../../components/render';
import profileIcon from '../../components/profile';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import submitBtn from '../../components/button';
import form from '../../components/form';
import { getImageUrl } from '../../components/helpers';

import { words } from '../../langs';
import { messageFileds } from './model';
import validateFormValues from '../../components/helpers/validate';
import { messageFormSchema } from './service';

import './style.scss';
import bem from 'bem-ts';

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

  const inputMessageLabel = label({ forAttr: messageFileds.message });
  inputMessageLabel.className = block('label');
  const inputMessage = textInput({
    name: messageFileds.message,
    type: 'text',
    placeHolder: words.MESSAGE,
  });
  inputMessageLabel.appendChild(inputMessage);
  inputMessage.className = block('input');
  const messagePattern = document.createElement('span');
  messagePattern.className = block('pattern');
  messagePattern.textContent = words.VALIDATION.PATTERTNS.MESSAGE;
  inputMessageLabel.appendChild(messagePattern);
  inputMessage.addEventListener('blur', (e): void => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(messageForm));
    const validation = validateFormValues(messageFormSchema, data);
    Object.keys(validation).forEach((key) => {
      if (validation[key].check === words.VALIDATION.ON_ERROR) {
        const invalid = block('input', {
          [words.VALIDATION.ON_ERROR]: true,
        });
        messageForm[key].parentElement.children[1].className = block(
          'pattern',
          {
            shown: true,
          }
        );
        return (messageForm[key].className = invalid);
      }
      messageForm[key].parentElement.children[1].className = block('pattern');
      return (messageForm[key].className = block('input'));
    });
  });

  const messageForm = form({ chidlren: [inputMessageLabel] });

  messageForm.addEventListener('submit', (e): void => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(messageForm));
    const validation = validateFormValues(messageFormSchema, data);
    Object.keys(validation).forEach((key) => {
      if (validation[key].check === words.VALIDATION.ON_ERROR) {
        const invalid = block('input', {
          [words.VALIDATION.ON_ERROR]: true,
        });
        messageForm[key].parentElement.children[1].className = block(
          'pattern',
          {
            shown: true,
          }
        );
        return (messageForm[key].className = invalid);
      }
      messageForm[key].parentElement.children[1].className = block('pattern');
      return (messageForm[key].className = block('input'));
    });
    console.log(data);
  });

  chatBox.appendChild(messageForm);

  chatContainer.appendChild(chatBox);

  return render(chatContainer);
};

export default mainPage;
