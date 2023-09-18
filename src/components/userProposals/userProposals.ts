import bem from 'bem-ts';
import { words } from '../../langs';

import { User } from '../../pages/settings/model';
import Block from '../block/block';
import Input from '../input/input';
import store from '../../store/store';
import { getAvatar } from './actions';

import './style.scss';

export default class Proposals extends Block {
  render() {
    const cn = bem('proposals');
    const choosed: User[] = [];
    if (undefined === this.props.proposals || undefined === this.props.users)
      return this.compile(`<ul class=${cn()}></ul>`, this.props);
    if ((this.props.proposals as []).length === 0)
      return this.compile(
        `<ul class=${cn()}>
          <li class=${bem('userProposal')()}>${words.NO_RESULTS}</li>
        </ul>`,
        this.props
      );

    const users = (this.props.proposals as User[]).reduce(
      (acc, user): string => {
        const { id, login } = user;

        if ((this.props.users as User[]).map((el) => el.id).includes(id))
          return acc;
        const blocName = login[0] + id + login[length - 1];
        this.children[blocName] = new UserProposal({
          user,
          events: [
            {
              eventName: 'click',
              callback: () => {
                if (!choosed.includes(user)) choosed.push(user);
              },
            },
          ],
        });

        acc += `<% this.` + blocName + ` %>`;
        return acc;
      },
      ``
    );

    this.children.add = new Input({
      classInput: cn('addButton'),
      type: 'button',
      value: words.ADD_USERS_TO_CHAT,
      events: [
        {
          eventName: 'click',
          callback: () => {
            if (choosed.length === 0) return;
            store.setState({ currentChat: { toAddUsers: choosed } });
            this.setPropsToValue('proposals', undefined);
          },
        },
      ],
    });

    this.children.clear = new Input({
      classInput: cn('clearButton'),
      type: 'button',
      value: words.CLEAR_SEARCH,
      events: [
        {
          eventName: 'click',
          callback: () => {
            this.setPropsToValue('proposals', undefined);
          },
        },
      ],
    });

    const temp = `<div class=${cn()}>
                    <ul id='suggest-users' class=${cn('list')}>
                      ${users}
                      <li class=${cn('control')}>
                        <% this.clear %>
                        <% this.add %>
                      </li>
                    </ul>
                  </div>`;

    return this.compile(temp, this.props);
  }
}

class UserProposal extends Block {
  onProposalClick() {
    (this as unknown as HTMLLIElement).className === 'userProposal'
      ? ((this as unknown as HTMLLIElement).className =
          'userProposal userProposal--pressed')
      : ((this as unknown as HTMLLIElement).className = 'userProposal');
  }

  render() {
    const cn = bem('userProposal');
    const { id, avatar, first_name, second_name } = this.props.user as User;

    const temp = `<li keyid=${id} class=${cn()}>
                      <img class=${cn('avatar')}
                      alt=${words.AVATAR_ALT}
                      src=${getAvatar(avatar as string)}>
                      <span class=${cn(
                        'name'
                      )}>${first_name} ${second_name}</span>
                    </li>`;
    this.events = [
      {
        eventName: 'click',
        callback: this.onProposalClick,
      },
    ];
    return this.compile(temp, this.props);
  }
}
