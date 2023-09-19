import bem from 'bem-ts';
import { words } from '../../langs';
import { User } from '../../pages/settings/model';
import Block from '../block/block';

import './style.sass';
import { getAvatar } from '../../pages/settings/actions';

export default class MembersToAdd extends Block {
  render() {
    const cn = bem('members');

    if (undefined === this.props.members)
      return this.compile('<div></div>', this.props);
    const users = (this.props.members as User[]).reduce((acc, user) => {
      const { id, login } = user;
      this.children[login + id] = new UserCard({
        user,
        users: this.props.members,
      });

      acc += `<% this.` + login + id + ` %>`;
      return acc;
    }, ``);

    const temp = `<div>
                    ${words.MEMBERS_To_ADD}
                    <ul class=${cn()}>
                      ${users}
                    </ul>
                  </div>`;

    return this.compile(temp, this.props);
  }
}

class UserCard extends Block {
  render() {
    const cn = bem('chatcard');
    const { id, avatar, first_name, second_name } = this.props.user as User;

    const temp = `<li keyid=${id} class=${cn()}>
                      <img class=${cn('avatar')}
                      alt=${words.AVATAR_ALT}
                      src=${getAvatar(avatar as string)}>
                      <span class=${cn(
                        'name'
                      )}>${first_name} ${second_name}</span>
                    </li>`;
    return this.compile(temp, this.props);
  }
}
