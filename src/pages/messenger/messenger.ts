import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import Chat from '../../components/chat/chat';
import ChatList from '../../components/chatList/chatList';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import './style.scss';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/router';
import store from '../../store/store';
import { getAvatar, getChats, logOut } from './actions';
import { getUserInfo } from '../settings/actions';
import { controlsButtons, messageFileds } from './model';
import IconedButton from '../../components/iconedButton/iconedButton';
import { getImageUrl } from '../../components/helpers';

export default class Messenger extends Block {
  constructor(props: someObj) {
    const { avatar } = store.getState().settings;
    const chants = store.getState().chatList;

    const defaultValues = {
      avatar: avatar,
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
      store.setState({ isLoad: true });
      const user = await getUserInfo();
      const chatList = await getChats();
      this.setProps({
        avatar: user.avatar,
        chatList: chatList as [],
      });
      store.setState({ settings: user, chatList });
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
  }

  async logout() {
    try {
      await logOut();
      store.setState({ isAuth: false });
      router.go(routes.sigin());
    } catch (err) {
      console.log(err);
    }
  }

  showAddChatModal() {
    store.setState({ modal: { type: words.modal.ADD_CHAT } });
  }

  setCurrentControl(name: string) {
    this.props.currentControl = name;
  }

  goSettings() {
    router.go(routes.settings());
  }

  validate(fieldName: string, value: string) {
    const error = value.match(words.inputs[fieldName].matchPttern);
    !error
      ? this.setProps({ errors: { [fieldName]: true } })
      : this.setProps({ errors: { [fieldName]: false } });
  }

  handleInput(e: Event, fieldName: string) {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value;
    this.setProps({ [fieldName]: value });
    store.setState({ messageInput: { [fieldName]: value } });
    this.validate(fieldName, value);
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
        this.props.modal?.type === words.modal.ADD_CHAT
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

    const chatList = new ChatList({
      class: block('chatList'),
      chatList: this.props.chatList,
    });

    this.children.logout = logoutButton;
    this.children.addChat = addChat;
    this.children.searhChat = searhChat;
    this.children.chatList = chatList;
    this.children.switchChats = switchChats;
    this.children.switchBanList = switchBanList;
    this.children.switchCamera = switchCamera;
    this.children.switchSettings = switchSettings;

    const messageInput = new LabeledInput({
      classLabel: block('label'),
      forAttr: messageFileds.message,
      children: {
        input: new Input({
          type: 'text',
          name: messageFileds.message,
          classInput: block('input'),
          tabindex: 1,
          required: true,
          placeholder: words.MESSAGE,
          value: this.props[messageFileds.message],
          events: [
            {
              eventName: 'blur',
              callback: ((e: Event) =>
                this.handleInput(e, messageFileds.message)).bind(this),
            },
          ],
        }),
      },
    });

    this.children.messageInput = messageInput;

    const chat = new Chat({ currentChat: store.getState().currentChat.id });

    this.children.chat = chat;

    const ctx = this.children;
    const temp = `<div class=${block()}>
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
                      <div class=${block('chatList')}>
                        <% this.chatList %>
                      </div>
                      <div class=${block('appControls')}>
                        <% this.switchChats %>
                        <% this.switchBanList %>
                        <% this.switchCamera %>
                        <% this.switchSettings %>
                      </div>
                    </section>
                    <section class=${block('chatBox')}>
                      <% this.chat %>
                      <form class=${block('wrapper')} >
                          <% this.messageInput %>
                      </form>
                    </section>
                  </div>`;
    return this.compile(temp, ctx);
  }
}
