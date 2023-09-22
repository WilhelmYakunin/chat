import Block from '../block/block';
import bem from 'bem-ts';
import { words } from '../../langs';
import { setChatAvatart, getAvatar } from './actions';
import { v4 as uuid } from 'uuid';

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
    const cn = bem('chatlist');
    const { chatList } = this.props;

    if (store.getState().isLoad) {
      return this.compile(
        `<span class=${cn('load')} >Loading...</span>`,
        this.props
      );
    }

    if (chatList?.length === 0) {
      const temp = `<span class=${cn('load')}>${words.EMPTY_CHATLIST}</span>`;

      return this.compile(temp, this.props);
    }

    const chats = chatList?.reduce((acc, chat) => {
      const { id, avatar, title, unread_count, last_message } = chat;

      const name = 'start' + uuid().split('-').join('') + 'end';

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
          content: last_message.content,
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

    const temp = `<ul class=${cn()}>${chats}</ul>`;

    return this.compile(temp, this.props);
  }
}

class NoLastMessage extends Block {
  render() {
    const cn = bem('chatcard');

    const { avatar, title, id } = this.props;

    const temp = `<li keyId=${id} class=${cn()}>
                      <img class=${cn('avatar')}
                      alt=${words.AVATAR_ALT}
                      src=${setChatAvatart(avatar as string)}> </img>
                      <div class=${cn('chatInfo')}>
                        <span class=${cn('title')}>${title}</span>
                        <span class=${cn('nomsg')}>${words.EMPTY_CHAT}</span>
                      </div>
                  </li>`;

    return this.compile(temp, this.props);
  }
}

class OrdinaryChatCard extends Block {
  render() {
    const cn = bem('chatcard');

    const { avatar, first_name, second_name, unread_count, id, time, content } =
      this.props;

    const now = new Date();
    const lastmsgTime = new Date(time as string);
    const getToThisday = () => {
      switch (now.getDay() - lastmsgTime.getDay()) {
        case 0:
          return lastmsgTime.getHours() + ':' + lastmsgTime.getMinutes();
        case -1:
          return words.YESTERDAY;
        default:
          return (
            lastmsgTime.getDay() +
            lastmsgTime.getMonth() +
            lastmsgTime.getFullYear()
          );
      }
    };

    const temp = `<li keyId=${id} class=${cn()}>
                    <img class=${cn('avatar')}
                      alt=${words.AVATAR_ALT}
                      src=${getAvatar(avatar as string)}> </img>
                    <div class=${cn('lastmsgInfo')}>
                      <span>${first_name + ' ' + second_name}</span>
                      <span>${(content as string).slice(-3)}</span>
                    </div>
                    <div class=${cn('unreadedInfo')}>
                      <span class=${cn('time')}>${getToThisday()}</span>
                      <span class=${cn('count')}>${unread_count}</span>
                    </div>
                  </li>`;

    return this.compile(temp, this.props);
  }
}
