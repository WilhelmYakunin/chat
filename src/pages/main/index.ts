import render from '../../components/render';
import profileIcon from '../../components/profile';
import textInput from '../../components/textInput';
import label from '../../components/labelTextInput';
import submitBtn from '../../components/button';
import form from '../../components/form';
import { getImageUrl } from '../../components/helpers';

import { words } from '../../langs';
import { messageFileds } from './model';
import { validate } from './controller';

import './style.scss';

const bemElem = (bem?: string) =>
  bem ? 'chat-page' + '__' + bem : 'chat-page';

const mainPage = () => {
  const chatContainer = document.createElement('div');
  chatContainer.className = bemElem();

  const board = document.createElement('section');
  board.className = bemElem('board');

  const controls = document.createElement('div');
  controls.className = bemElem('controls');

  const avatar = profileIcon({
    iconLink: getImageUrl('/pictures/test_ico.png'),
  });
  avatar.className = bemElem('avatar');
  const chatsHeader = document.createElement('h2');
  chatsHeader.className = bemElem('chats-header');
  chatsHeader.textContent = words.CHATS_HEADER;
  const addChat = submitBtn({ value: '+', type: 'button' });
  addChat.className = bemElem('add-tree');
  const addChatSection = document.createElement('div');
  addChatSection.className = bemElem('add-chat');
  addChatSection.appendChild(avatar);
  addChatSection.appendChild(chatsHeader);
  addChatSection.appendChild(addChat);
  const serch = textInput({
    name: 'serach',
    type: 'text',
    placeHolder: words.SEARCH_PLACEHOLDER,
  });
  serch.className = bemElem('search');
  controls.appendChild(addChatSection);
  controls.appendChild(serch);

  const chatList = document.createElement('div');
  chatList.className = bemElem('chat-list');
  board.appendChild(controls);
  board.appendChild(chatList);

  const appControls = document.createElement('div');
  appControls.className = bemElem('app-controls');
  const showChats = document.createElement('span');
  showChats.className = bemElem('app-control-setter--pressed');
  const chatsIcon = document.createElement('img');
  chatsIcon.src = getImageUrl('/pictures/envelope.svg');
  showChats.appendChild(chatsIcon);
  appControls.appendChild(showChats);

  const showBanList = document.createElement('span');
  showBanList.className = bemElem('app-control-setter');
  const banListIcon = document.createElement('img');
  banListIcon.src = getImageUrl('/pictures/pirate.svg');
  showBanList.appendChild(banListIcon);
  appControls.appendChild(showBanList);

  const showCamera = document.createElement('span');
  showCamera.className = bemElem('app-control-setter');
  const cameraIcon = document.createElement('img');
  cameraIcon.src = getImageUrl('/pictures/camera.svg');
  showCamera.appendChild(cameraIcon);
  appControls.appendChild(showCamera);

  const showSettings = document.createElement('span');
  showSettings.className = bemElem('app-control-setter');
  const settngsIcon = document.createElement('img');
  settngsIcon.src = getImageUrl('/pictures/settings.svg');
  showSettings.appendChild(settngsIcon);
  appControls.appendChild(showSettings);

  board.appendChild(appControls);

  chatContainer.appendChild(board);

  const chatBox = document.createElement('section');
  chatBox.className = bemElem('chat-box');

  const chat = document.createElement('article');
  chat.innerHTML = '<p>no message here</p>';
  chatBox.appendChild(chat);

  const inputMessageLabel = label({ forAttr: messageFileds.message });
  inputMessageLabel.className = bemElem('message-label');
  const inputMessage = textInput({
    name: messageFileds.message,
    type: 'text',
    placeHolder: words.MESSAGE,
  });
  inputMessageLabel.appendChild(inputMessage);
  inputMessage.className = bemElem('input-message');

  const messageForm = form({ chidlren: [inputMessageLabel] });
  messageForm.addEventListener('submit', async (e): Promise<void> => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(messageForm));
    validate(data);
    console.log(data);
  });
  chatBox.appendChild(messageForm);

  chatContainer.appendChild(chatBox);

  return render(chatContainer);
};

export default mainPage;
