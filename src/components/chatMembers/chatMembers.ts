import bem from 'bem-ts';
import { words } from '../../langs';
import { User } from '../../pages/settings/model';
import store from '../../store/store';
import Block from '../block/block';

import './style.sass';
import Input from '../input/input';
import { deleteChatUsers } from './actions';
import { getAvatar } from '../../pages/settings/actions';

export default class ChatMembers extends Block {
  render() {
    const cn = bem('members');

    if (undefined === this.props.members) return this.compile('', this.props);
    const users = (this.props.members as User[]).reduce((acc, user) => {
      const { id, login } = user;
      this.children[login + id] = new UserCard({
        user,
        users: this.props.members,
      });

      acc += `<% this.` + login + id + ` %>`;
      return acc;
    }, ``);

    const temp = `<ul class=${cn()}>
                    ${users}
                </ul>`;

    return this.compile(temp, this.props);
  }
}

class UserCard extends Block {
  render() {
    const cn = bem('userChatCard');
    const { id, avatar, first_name, second_name } = this.props.user as User;

    this.children.deleteButton =
      store.getState().settings.id !== id
        ? new Input({
            type: 'button',
            classInput: cn('deleteButton'),
            value: words.DELETE_USER,
            events: [
              {
                eventName: 'click',
                callback: (async () => {
                  try {
                    await deleteChatUsers({
                      userId: [id],
                      chatId: store.getState().currentChat.id,
                    });
                    this.destroy();
                  } catch (err) {
                    console.log(err);
                  }
                }).bind(this),
              },
            ],
          })
        : new ChatOwner();

    const temp = `<li keyid=${id} class=${cn()}>
                      <img class=${cn('avatar')}
                      alt=${words.AVATAR_ALT}
                      src=${getAvatar(avatar as string)}>
                      <span class=${cn(
                        'name'
                      )}>${first_name} ${second_name}</span>
                      <% this.deleteButton %>
                    </li>`;
    return this.compile(temp, this.props);
  }
}

class ChatOwner extends Block {
  render() {
    const temp = `<span class=${bem('chatowner')()}>${words.CHAT_OWNER}</span>`;
    return this.compile(temp, this.props);
  }
}
