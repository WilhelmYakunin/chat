import Block from '../block/block';
import bem from 'bem-ts';
import { words } from '../../langs';
import { setChatAvatart, getAvatar } from './actions';

import store from '../../store/store';
import './style.scss';

export default class ChatList extends Block {
  componentDidMount() {
    store.subscribe((state) => {
      if (this.props.chatList !== state.chatList)
        this.props.chatList = state.chatList;
    }, this.id);
  }

  onChatCardClick() {
    console.log(this);
  }

  render() {
    const { chatList } = this.props;

    if (store.getState().isLoad) {
      return this.compile(
        '<span style="color: white" >Loading...</span>',
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

      const name = getCamel(chat.title);

      if (!last_message) {
        this.children[name] = new NoLastMessage({
          avatar,
          title,
          id,
          events: [{ eventName: 'click', callback: this.onChatCardClick }],
        });
      } else {
        this.children[name] = new ordinaryChatCard({
          avatar: last_message.user.avatar,
          first_name: last_message.user.first_name,
          second_name: last_message.user.second_name,
          id,
          unread_count,
          time: last_message.time,
          events: [{ eventName: 'click', callback: this.onChatCardClick }],
        });
      }

      acc += '<% this.' + name + ' %>';
      return acc;
    }, ``);

    const temp = `<div <% if (this.class) { %> class="<% this.class %>"<% } %> > 
                        ${chats}
                    </div>`;

    return this.compile(temp, this.props);
  }
}

class NoLastMessage extends Block {
  render() {
    const cn = bem('chatCard');

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

class ordinaryChatCard extends Block {
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

// if (chatList?.length !== 0 && undefined !== chatList) {
//   const cn = bem('chatCard');

//   const handleChatClick = (e: Event) => {
//     console.log(e);
//   };

//   content = chatList.reduce((acc, chat) => {
//     const { id, avatar, title, unread_count, last_message } = chat;
//     let member;

//     if (last_message) {
//       const {
//         user: { first_name, second_name, avatar },
//         time,
//       } = last_message;

//       member = `<div id=${id} class=${cn()}>
//                   <img class=${cn('avatar')}
//                   alt=${words.AVATAR_ALT}
//                   src=${getAvatar(avatar)}> </img>
//                   <div class=${cn('lastmsgInfo')}>
//                     <span>${first_name + ' ' + second_name}</span>
//                   </div>
//                   <div class=${cn('unreadedInfo')}>
//                     <span>${unread_count}</span>
//                     <span>${time}</span>
//                   </div>
//                 </div>`;
//     } else {
//       member = `<div class=${cn()}>
//                       <img class=${cn('avatar')}
//                       alt=${words.AVATAR_ALT}
//                       src=${setChatAvatart(avatar)}> </img>
//                       <div class=${cn('chatInfo')}>
//                         <span class=${cn('title')}>${title}</span>
//                         <span class=${cn('nomsg')}>${
//         words.EMPTY_CHAT
//       }</span>
//                       </div>
//               </div>`;
//     }
//     acc += member;
//     return acc;
//   }, ``);
// } else {
//   content = `<span>${words.EMPTY_CHATLIST}</span>`;
// }
