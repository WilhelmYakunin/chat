import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import ErrMessage from '../../components/errMessage/ErrMessage';
import AddChatModal from '../../components/addChatModal/addChatModal';
import ChatList from '../../components/chatList/chatList';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import './style.scss';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/router';
import store, { Chat } from '../../state';
import { getAvatar, getChats, logOut } from './service';
import { getUserInfo } from '../settings/service';
import { User } from '../settings/model';
import { controlsButtons } from './model';
import IconedButton from '../../components/iconedButton/iconedButton';
import { getImageUrl } from '../../components/helpers';

export default class Messenger extends Block {
  constructor(props: someObj) {
    const { avatar, isLoading } = store.getState().settings;
    const chants = store.getState().chats;

    const defaultValues = {
      avatar: avatar,
      isLoading: isLoading,
      modal: { type: 'none' },
      currentControl: controlsButtons.chats,
      chants,
    };

    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren);
    this.setUserInfo();
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps((this.props.modal = state.modal));
    }, this.id);
  }

  async setUserInfo() {
    try {
      this.setProps({ isLoading: true });
      const { avatar }: User = await getUserInfo();
      const chats = await getChats();
      this.setProps({
        avatar,
        chats,
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setProps({ isLoading: false });
    }
  }

  async logout() {
    await logOut();
    router.go(routes.sigin());
  }

  showAddChatModal() {
    store.setState({ modal: { type: 'addChatModal' } });
  }

  setCurrentControl(name: string) {
    this.props.currentControl = name;
  }

  goSettings() {
    router.go(routes.settings());
  }

  render() {
    const block = bem('messenger');

    const logoutButton = new Input({
      type: 'button',
      classInput: block('logoutButton'),
      value: words.LOGOUT,
      events: [
        {
          eventName: 'click',
          callback: this.logout,
        },
      ],
    });

    const addChat = new Input({
      type: 'button',
      classInput:
        this.props.modal?.type === 'addChatModal'
          ? block('addTree', { pressed: true })
          : block('addTree'),
      value: '+',
      events: [
        {
          eventName: 'click',
          callback: (e: Event) => {
            e.preventDefault();
            this.showAddChatModal();
          },
        },
      ],
    });

    const searhChat = new Input({
      type: 'text',
      name: 'search',
      classInput: block('search'),
      placeholder: words.SEARCH_PLACEHOLDER,
      required: true,
    });

    const [switchChats, switchBanList, switchCamera, switchSettings] =
      Object.keys(controlsButtons).map(
        (name) =>
          new IconedButton({
            class:
              name === this.props.currentControl
                ? block('appControlSetter', { pressed: true })
                : block('appControlSetter'),
            alt: name,
            src: getImageUrl('/pictures/' + name + '.svg'),
            events: [
              {
                eventName: 'click',
                callback: (e: Event) => {
                  e.preventDefault();
                  return name === controlsButtons.settings
                    ? this.goSettings()
                    : this.setCurrentControl(name);
                },
              },
            ],
          })
      );

    switchSettings.events = [
      {
        eventName: 'click',
        callback: this.goSettings.bind(this),
      },
    ];

    const addChatModal = new AddChatModal();

    const chatList = new ChatList({
      class: block('chatList'),
      chatList: this.props.chats,
    });

    this.children.logout = logoutButton;
    this.children.addChat = addChat;
    this.children.searhChat = searhChat;
    this.children.switchChats = switchChats;
    this.children.switchBanList = switchBanList;
    this.children.switchCamera = switchCamera;
    this.children.switchSettings = switchSettings;
    this.children.modal = addChatModal;
    this.children.chatList = chatList;

    const ctx = this.children;
    const temp = `<div class=${block()}>
                    <% this.modal %>
                    <section class=${block('board')}>
                      <div class=${block('controls')}>
                      <div class=${block('addChat')}>
                        <img class=${block('avatar')} 
                        alt=${words.AVATAR_ALT} 
                        src=${getAvatar(this.props.avatar as string)}>
                        <h2 class=${block('chatsHeader')}>
                        ${words.CHATS_HEADER}
                        </h2>
                        <% this.logout %>
                        <% this.addChat %>
                      </div>
                      <% this.searhChat %>
                      </div>
                      <% this.chatList %>
                      <div class=${block('appControls')}>
                        <% this.switchChats %>
                        <% this.switchBanList %>
                        <% this.switchCamera %>
                        <% this.switchSettings %>
                      </div>
                    </section>
                    <form class=${block('wrapper')} >
                        <% this.messageInput %>
                        <% this.button %>
                    </form>
                  </div>`;
    return this.compile(temp, ctx);
  }
}

// import { getImageUrl } from '../../components/helpers';

// import { words } from '../../langs';
// import { messageFileds } from './model';
// import { validateInput } from '../../components/helpers/validate';
// import { logOut, messageFormSchema } from './service';

// import './style.scss';
// import bem from 'bem-ts';
// import Block from '../../components/block/block';
// import {
//   formTemplate,
//   inputTemplate,
//   labelTemplate,
//   patternTemplate,
// } from './templates';
// import state from '../../state';
// import router from '../../router/router';
// import { routes } from '../../router/routes';

// const block = bem('chat');

// const mainPage = (): Block => {
//   const img = new Block('img', {
//     template: "<img src={{icolink}} alt='user depiction'> </img>",
//     data: { icolink: getImageUrl('/pictures/test_ico.png') },
//   });

//   const avatar = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('avatar') },
//     children: [img],
//   });

//   const chatsHeader = new Block('h2', {
//     template: '<h2 class={{class}}>{{{text}}}</h2>',
//     data: {
//       text: words.CHATS_HEADER,
//       class: block('chatsHeader'),
//     },
//   });

//   const addChat = new Block('button', {
//     template: "<button type='button' class={{class}}>+</button>",
//     data: { class: block('addTree') },
//   });

//   const logoutBtn = new Block('button', {
//     template: "<button type='button' class={{class}}>{{{text}}}</button>",
//     data: { class: block('logoutButton'), text: words.LOGOUT },
//     events: [
//       {
//         eventName: 'click',
//         callback: async (e: Event) => {
//           e.preventDefault();
//           await logOut()
//             .then(() => {
//               // state.user.isLogged = false;
//               router.go(routes.login());
//             })
//             .catch((err) => alert(err.reason));
//         },
//       },
//     ],
//   });

//   const addChatSection = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('addChat') },
//     children: [avatar, chatsHeader, logoutBtn, addChat],
//   });

//   const serch = new Block('input', {
//     template:
//       "<input name='search' class={{class}} type='text' placeholder={{{text}}}></input>",
//     data: { text: words.SEARCH_PLACEHOLDER, class: block('search') },
//   });

//   const controls = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('controls') },
//     children: [addChatSection, serch],
//   });

//   const chatList = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('chatList') },
//   });

//   const controlsTemplate =
//     '<span class={{class}}><img alt={{alt}} src={{imglink}} /></span>';

//   const showChats = new Block('span', {
//     template: controlsTemplate,
//     data: {
//       class: block('appControlSetter', { pressed: true }).split(' ')[1],
//       alt: 'showAllChats',
//       imglink: getImageUrl('/pictures/envelope.svg'),
//     },
//   });

//   const showBanList = new Block('span', {
//     template: controlsTemplate,
//     data: {
//       class: block('appControlSetter'),
//       alt: 'showAllChats',
//       imglink: getImageUrl('/pictures/pirate.svg'),
//     },
//   });

//   const showCamera = new Block('span', {
//     template: controlsTemplate,
//     data: {
//       class: block('appControlSetter'),
//       alt: 'showAllChats',
//       imglink: getImageUrl('/pictures/camera.svg'),
//     },
//   });

//   const showSettings = new Block('span', {
//     template: controlsTemplate,
//     data: {
//       class: block('appControlSetter'),
//       alt: 'showAllChats',
//       imglink: getImageUrl('/pictures/settings.svg'),
//     },
//     events: [
//       {
//         eventName: 'click',
//         callback: (e: Event) => {
//           e.preventDefault();
//           router.go(routes.settings());
//         },
//       },
//     ],
//   });

//   const chatControls = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('appControls') },
//     children: [showChats, showBanList, showCamera, showSettings],
//   });

//   const messageInput = new Block('input', {
//     template: inputTemplate,
//     data: {
//       name: messageFileds.message,
//       class: block('input'),
//       placeholder: words.MESSAGE,
//       tabIndex: 1,
//     },
//     events: [
//       {
//         eventName: 'blur',
//         callback: (e: Event) =>
//           validateInput({
//             target: e.target as HTMLElement,
//             rule: messageFormSchema.message.pattern,
//           }),
//       },
//     ],
//   });

//   const messagePattern = new Block('div', {
//     template: patternTemplate,
//     data: {
//       class: block('pattern'),
//       text: words.VALIDATION.PATTERTNS.MESSAGE,
//     },
//   });

//   const inputMessageLabel = new Block('label', {
//     template: labelTemplate,
//     data: {
//       forAttr: messageFileds.message,
//       labelClass: block('label'),
//     },
//     children: [messageInput, messagePattern],
//   });

//   const messageForm = new Block('form', {
//     template: formTemplate,
//     children: [inputMessageLabel],
//     events: [
//       {
//         eventName: 'submit',
//         callback: (e: Event): void => {
//           e.preventDefault();
//           const data: { [x: string]: unknown } = {};
//           for (const key in messageFormSchema) {
//             const el = (e.target as HTMLFormElement).elements[
//               key as keyof HTMLFormControlsCollection
//             ];
//             data[key] = (el as unknown as HTMLInputElement).value;
//             validateInput({
//               target: el as HTMLElement,
//               rule: messageFormSchema[key].pattern,
//             });
//           }

//           console.log(data);
//         },
//       },
//     ],
//   });

//   const chatBox = new Block('section', {
//     template: '<section class={{class}}></section>',
//     data: { class: block('chatBox') },
//     children: [messageForm],
//   });

//   const board = new Block('section', {
//     template: '<section class={{class}}></section>',
//     data: { class: block('board') },
//     children: [controls, chatList, chatControls],
//   });

//   const chatContainer = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block() },
//     children: [board, chatBox],
//   });

//   const coverage = new Block('div', { children: [chatContainer] });

//   return coverage;
// };

// export default mainPage;
