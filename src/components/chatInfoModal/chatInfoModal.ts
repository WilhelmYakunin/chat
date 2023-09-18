import Block, { someObj } from '../block/block';
import Input from '../input/input';

import bem from 'bem-ts';
import './style.scss';
import { words } from '../../langs';

import store from '../../store/store';
import {
  addUserToChat,
  deleteChatUsers,
  getParticipants,
  searchForUser,
} from './actions';
import { User } from '../../pages/settings/model';
import IconedButton from '../iconedButton/iconedButton';
import { getImageUrl } from '../helpers';
import { getAvatar } from '../../pages/settings/actions';
import { searchFromFields } from './model';
import { setChatOwnerFirst } from '../chat/actions';

export default class ChatInfoModal extends Block {
  constructor(props?: someObj) {
    const defaultValues = {
      isOpen: store.getState().modal.type === 'chatInfoModal',
      users: store.getState().modal.users,
      inputValue: props?.inputValue,
    };

    const propsAndChildren = { ...props, ...defaultValues };
    super(propsAndChildren);
  }

  componentDidMount() {
    store.subscribe((state) => {
      if (state.modal.type !== this.props.isOpen)
        this.setProps({ isOpen: state.modal.type === 'chatInfoModal' });
    }, this.id);
    store.subscribe((state) => {
      if (state.modal.users !== this.props.users) {
        this.setProps({ users: state.modal.users });
      }
    }, this.id);
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const value = (e.target as HTMLFormElement)[searchFromFields.search].value;
    const proposals = await searchForUser(value);
    this.setProps({ inputValue: value, proposals });
  }

  render() {
    const block = bem('chatInfomodal');

    const input = new Input({
      type: 'text',
      classInput: block('input'),
      name: searchFromFields.search,
      required: true,
      maxLength: 10,
      value: this.props.inputValue,
      placeholder: words.modal.ADD_NEW_MEMBER,
      events: [
        {
          eventName: 'submit',
          callback: ((e: Event) => this.handleSubmit(e)).bind(this),
        },
      ],
    });

    const close = new Input({
      classInput: block('close'),
      type: 'button',
      value: 'X',
      events: [
        {
          eventName: 'click',
          callback: () => {
            store.setState({ modal: { type: 'none' } });
            this.destroy();
          },
        },
      ],
    });

    this.children.close = close;
    this.children.input = input;

    this.children.proposals = this.props.proposals
      ? new Proposals({
          users: this.props.users,
          proposals: this.props.proposals,
        })
      : null;

    this.children.users = this.props.users
      ? new ChatUsers({ users: this.props.users })
      : null;

    this.events = [
      {
        eventName: 'submit',
        callback: ((e: Event) => this.handleSubmit(e)).bind(this),
      },
    ];

    const temp = `<form <% if (this.isOpen) { %> class=${block()} <% } %> <% if (!this.isOpen) { %> hidden <% } %> >
                    <div class=${block('container')}>
                        <div class=${block('header')} >
                          <span>${words.modal.HEADER}</span>
                          <% this.close %>
                        </div>
                        <div class=${block('serachWrapper')}>
                          <% this.input %>
                          <% this.proposals %>
                        </div>
                        <div class=${block('footer')}>
                          <% this.users %>
                      </div>
                    </div>
                  </form>`;

    return this.compile(temp, this.props);
  }
}
class Proposals extends Block {
  render() {
    const cn = bem('proposals');
    const choosed: string[] = [];
    const users = (this.props.proposals as User[]).reduce(
      (acc, user): string => {
        const { id, login } = user;

        if ((this.props.users as User[]).map((el) => el.id).includes(id))
          return acc;

        this.children[login + id] = new UserProposal({
          user,
          events: [
            {
              eventName: 'click',
              callback: () => {
                if (!choosed.includes(id)) choosed.push(id);
              },
            },
          ],
        });

        acc += `<% this.` + login + id + ` %>`;
        return acc;
      },
      ``
    );

    this.children.addButton = new Input({
      type: 'button',
      classInput: cn('addButton'),
      value: words.ADD_USERS_TO_CHAT,
      events: [
        {
          eventName: 'click',
          callback: async () => {
            try {
              if (choosed.length === 0) return;
              await addUserToChat({
                chatId: store.getState().currentChat,
                usersIds: choosed,
              });
              this.setProps({ proposals: [] });
              const newUsers = await getParticipants(
                store.getState().currentChat
              );
              setChatOwnerFirst(newUsers as User[]);
              store.setState({
                modal: {
                  users: newUsers,
                },
              });
              this.destroy();
            } catch (err) {
              console.log(err);
            }
          },
        },
      ],
    });

    const temp = `<div class=${cn()}>
                    <ul class=${cn('list')}>
                      ${users}
                    </ul>
                    <% this.addButton %>
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
                    src=${getAvatar(avatar)}>
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

class ChatUsers extends Block {
  render() {
    const cn = bem('users');
    const users = (this.props.users as User[]).reduce((acc, user) => {
      const { id, login } = user;
      this.children[login + id] = new UserCard({
        user,
        users: this.props.users,
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
        ? new IconedButton({
            class: cn('deleteButton'),
            alt: 'deleteUser',
            src: getImageUrl('/pictures/' + 'bin' + '.svg'),
            events: [
              {
                eventName: 'click',
                callback: (async () => {
                  const res = await deleteChatUsers({
                    usersIds: [id],
                    chatId: store.getState().currentChat,
                  });

                  const newUsers = (this.props.users as User[]).filter(
                    (user) => {
                      console.log(user.id !== id, id);
                      return user.id !== id;
                    }
                  );
                  console.log(
                    'user Id: ',
                    id,
                    'res: ',
                    res,
                    store.getState().currentChat,
                    'newUsers: ',
                    newUsers
                  );
                  store.setState({ modal: { users: newUsers } });
                  this.destroy();
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
