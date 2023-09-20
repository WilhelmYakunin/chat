import Block from '../block/block';
import bem from 'bem-ts';
import { words } from '../../langs';
import { setChatAvatart, getAvatar } from './actions';

import store from '../../store/store';
import './style.sass';

export default class ChatList extends Block {
  componentDidMount() {
    store.subscribe((state) => {
      if (this.props.chatList !== state.chatList)
        this.props.chatList = state.chatList;
    }, this.id);
  }

  onChatCardClick(e: Event, id: string) {
    e.preventDefault();
    if (id === store.getState().currentChat.id) return;
    store.setState({ currentChat: { id } });
  }

  render() {
    const { chatList } = this.props;

    if (store.getState().isLoad) {
      return this.compile(
        `<span class=${bem('load')()} >Loading...</span>`,
        this.props
      );
    }

    if (chatList?.length === 0) {
      const temp = `<span>${words.EMPTY_CHATLIST}</span>`;

      return this.compile(temp, this.props);
    }

    const chats = chatList?.reduce((acc, chat) => {
      const { id, avatar, title, unread_count, last_message } = chat;

      const getCamel = (str: string): string =>
        str
          .split(' ')
          .map((word, i) =>
            i !== 0 ? word[0].toUpperCase() + word.slice(1) : word
          )
          .join('');

      const name = getCamel(chat.title + id);

      if (!last_message) {
        this.children[name] = new NoLastMessage({
          avatar,
          title,
          id,
          events: [
            {
              eventName: 'click',
              callback: (e: Event) => this.onChatCardClick(e, id),
            },
          ],
        });
      } else {
        this.children[name] = new OrdinaryChatCard({
          avatar: last_message.user.avatar,
          first_name: last_message.user.first_name,
          second_name: last_message.user.second_name,
          id,
          unread_count,
          time: last_message.time,
          events: [
            {
              eventName: 'click',
              callback: (e: Event) => this.onChatCardClick(e, id),
            },
          ],
        });
      }

      acc += '<% this.' + name + ' %>';
      return acc;
    }, ``);

    const temp = `<div>${chats}</div>`;

    return this.compile(temp, this.props);
  }
}

class NoLastMessage extends Block {
  render() {
    const cn = bem('chatcard');

    const { avatar, title, id } = this.props;

    const temp = `<div keyId=${id} class=${cn()}>
                      <img class=${cn('avatar')}
                      alt=${words.AVATAR_ALT}
                      src=${setChatAvatart(avatar as string)}> </img>
                      <div class=${cn('chatInfo')}>
                        <span class=${cn('title')}>${title}</span>
                        <span class=${cn('nomsg')}>${words.EMPTY_CHAT}</span>
                      </div>
                  </div>`;

    return this.compile(temp, this.props);
  }
}

class OrdinaryChatCard extends Block {
  render() {
    const cn = bem('chatCard');

    const { avatar, first_name, second_name, unread_count, id, time } =
      this.props;

    const temp = `<div keyId=${id} class=${cn()}>
                  <img class=${cn('avatar')}
                    alt=${words.AVATAR_ALT}
                    src=${getAvatar(avatar as string)}> </img>
                  <div class=${cn('lastmsgInfo')}>
                    <span>${first_name + ' ' + second_name}</span>
                  </div>
                  <div class=${cn('unreadedInfo')}>
                    <span>${unread_count}</span>
                    <span>${time}</span>
                  </div>
                </div>`;

    return this.compile(temp, this.props);
  }
}
