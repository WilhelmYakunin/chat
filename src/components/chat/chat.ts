import bem from 'bem-ts';
import store from '../../store/store';
import Block, { someObj } from '../block/block';
import { words } from '../../langs';
import { setChatAvatart } from '../chatList/actions';

import './style.sass';
import IconedButton from '../iconedButton/iconedButton';
import { getImageUrl } from '../helpers';
import { modalTypes } from '../modal/model';
import Messages from '../message/message';
export default class Chat extends Block {
  constructor(props: someObj) {
    const defaultValues = {
      chatList: store.getState().chatList,
    };
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren);
    store.subscribe((state) => {
      state.currentChat.id === 'none' && this.setProps({ currentChat: 'none' });
    }, this.id);
  }

  render() {
    const cn = bem('chat');

    if (this.props.currentChat === 'none')
      return this.compile(
        `<div class=${cn('init')}>${words.CHOOSE_CHAT}</div>`,
        this.props
      );

    const chat = this.props.chatList?.find(
      (el) => el.id === this.props.currentChat
    );

    const participants = new Participants({
      events: [
        {
          eventName: 'click',
          callback: () =>
            store.setState({
              currentChat: {
                isOpen: true,
                id: this.props.currentChat,
              },
            }),
        },
      ],
    });

    this.children.participants = participants;

    const deleteChat = new IconedButton({
      class:
        store.getState().modal.type === modalTypes.deleteChat
          ? cn('delete', { pressed: true })
          : cn('delete'),
      alt: modalTypes.deleteChat,
      src: getImageUrl('/pictures/' + 'bin' + '.svg'),
      events: [
        {
          eventName: 'click',
          callback: () =>
            store.setState({ modal: { type: modalTypes.deleteChat } }),
        },
      ],
    });

    this.children.deleteChat = deleteChat;

    const renameChat = new IconedButton({
      class:
        store.getState().modal.type === modalTypes.changeChatAvatar
          ? cn('rename', { pressed: true })
          : cn('rename'),
      alt: modalTypes.changeChatAvatar,
      src: getImageUrl('/pictures/' + 'upload' + '.svg'),
      events: [
        {
          eventName: 'click',
          callback: () =>
            store.setState({ modal: { type: modalTypes.changeChatAvatar } }),
        },
      ],
    });

    this.children.renameChat = renameChat;
    this.children.messages = new Messages();

    const ctx = this.children;
    const temp = `<div class=${cn()}>
                      <div class=${cn('header')}>
                        <img class=${cn('avatar')}
                        alt=${words.AVATAR_ALT}
                        src=${setChatAvatart(chat?.avatar as string)}> </img>
                        <div class=${cn('info')}>
                          <span class=${cn('title')}>${chat?.title}</span>
                          <% this.participants %>
                        </div>
                        <% this.renameChat %>
                        <% this.deleteChat %>
                      </div>
                        <% this.messages %>
                    </div>`;

    return this.compile(temp, ctx);
  }
}

class Participants extends Block {
  render() {
    const cn = bem('participants');
    const temp = `<span class=${cn()}>${words.PARTICIPANTS}</span>`;
    return this.compile(temp, this.props);
  }
}
