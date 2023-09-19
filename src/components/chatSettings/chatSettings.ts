import bem from 'bem-ts';
import store from '../../store/store';
import Block, { someObj } from '../block/block';
import Input from '../input/input';

import './style.sass';
import { words } from '../../langs';
import ChatMembers from '../chatMembers/chatMembers';
import { getParticipants, setChatOwnerFirst } from '../chat/actions';
import { User } from '../../pages/settings/model';
import { searchFromFields } from './model';
import { addUserToChat, searchForUser } from './actions';
import Proposals from '../userProposals/userProposals';
import MembersToAdd from '../membersToAdd/membersToAdd';

const cn = bem('chatsettings');

export default class ChatSettings extends Block {
  constructor(props: someObj) {
    super({ ...props });
    store.subscribe((state) => {
      if (state.currentChat.isOpen) {
        this.setProps({ isOpen: true });
        this.getMambers();
      }
      if (state.currentChat.toAddUsers) {
        state.currentChat.toAddUsers.length !== 0 &&
          this.setProps({
            toAddUsers: state.currentChat.toAddUsers as User[],
          });
      }
    }, this.id);
  }

  async getMambers() {
    try {
      const members = await getParticipants(store.getState().currentChat.id);
      setChatOwnerFirst(members as []);
      this.setProps({ members });
    } catch (err) {
      console.log(err);
    }
  }

  close() {
    store.setState({ currentChat: { isOpen: false } });
    this.setProps({ isOpen: false, inputValue: '' });
    this.setPropsToValue('members', undefined);
    this.setPropsToValue('proposals', undefined);
    this.setPropsToValue('toAddUsers', undefined);
    store.setCurrentChattoAddUsersToValue([]);
  }

  focusOnInput() {
    const inputS = document.getElementsByClassName(cn('input'));

    if (inputS[0]) {
      const valueLastIndex = (this.props.inputValue as string).length;
      const inputRef = inputS[0] as HTMLInputElement;
      inputRef.setSelectionRange(valueLastIndex, valueLastIndex);
      inputRef.focus();
    }
  }

  handleClear(e: Event) {
    e.preventDefault();
    this.setPropsToValue('proposals', undefined);
    this.setProps({ inputValue: '' });
  }

  async handleSearch(e: Event) {
    e.preventDefault();

    const value = (e.target as HTMLFormElement).value;
    if (value === '') {
      this.setProps({ inputValue: '' });
      this.setPropsToValue('proposals', undefined);
      this.focusOnInput();
      return;
    }
    try {
      const proposals = await searchForUser(value);
      this.setProps({ inputValue: value, proposals: proposals as [] });
      console.log(this.props);
      this.focusOnInput();
    } catch (err) {
      console.log(err);
    }
  }

  async onAddUsers() {
    if (
      undefined === this.props.toAddUsers ||
      this.props.toAddUsers.length === 0
    ) {
      return this.close();
    }
    const usersIds = this.props.toAddUsers?.map(({ id }) => id);
    const chatId = store.getState().currentChat.id;
    try {
      if (usersIds) {
        try {
          await addUserToChat({ chatId, usersIds });
          this.setProps({
            members: [this.props.usersIds, ...this.props.toAddUsers],
          });
          this.setPropsToValue('toAddUsers', undefined);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const close = new Input({
      classInput: cn('close'),
      name: searchFromFields.search,
      type: 'button',
      value: 'X',
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
    });

    const input = new Input({
      type: 'search',
      classInput: cn('input'),
      name: 'title',
      value: this.props.inputValue,
      placeholder: words.modal.SEARCH_NEW_MEMBER,
      ariaDecription: words.SEARCH_ARIADESCRIPTION,
      maxLength: 10,
      ariaControls: 'suggest-users',
      events: [
        {
          eventName: 'input',
          callback: ((e: Event) => this.handleSearch(e)).bind(this),
        },
        {
          eventName: 'submit',
          callback: ((e: Event) => this.handleSearch(e)).bind(this),
        },
      ],
    });

    this.children.close = close;
    this.children.chatMembers = new ChatMembers({
      members: this.props.members,
    });
    this.children.input = input;

    this.children.proposals = new Proposals({
      users: this.props.members,
      proposals: this.props.proposals,
    });

    this.children.toAddUsers = new MembersToAdd({
      members: this.props.toAddUsers,
    });

    this.children.abolution = new Input({
      classInput: cn('abolution'),
      type: 'button',
      value: words.modal.ABOLUTION,
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
    });

    this.children.confirm = new Input({
      classInput: cn('confirm'),
      type: 'button',
      value: words.modal.CONFIRM,
      events: [
        {
          eventName: 'click',
          callback: this.onAddUsers.bind(this),
        },
      ],
    });

    const temp = `<div <% if (this.isOpen) { %> class=${cn()} <% } %>  <% if (!this.isOpen) { %> hidden <% } %> >
                    <form action='' class=${cn('wrapper')} autocomplete="off">
                        <div class=${cn('header')}>
                            <h2>${words.CHAT_MEMBERS}</h2>
                            <div>
                                <% this.close %>
                            </div>
                        </div>
                          <% this.chatMembers %>
                        <label tabindex="0" aria-label="search" role="searchbox" contenteditable>
                          <% this.input %>
                          <% this.proposals %> 
                        </label>
                          <% this.toAddUsers %>
                        <div class=${cn('footer')}>
                          <% this.abolution %>
                          <% this.confirm %>
                        </div>
                    </form>                     
                </div>`;

    return this.compile(temp, this.props);
  }
}
