import bem from 'bem-ts';
import store from '../../store/store';
import Block, { someObj } from '../block/block';
import { words } from '../../langs';
import { setChatAvatart } from '../chatList/actions';

import './style.scss';

export default class Chat extends Block {
  constructor(props: someObj) {
    const defaultValues = {
      chatList: store.getState().chatList,
    };
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren);
  }

  render() {
    const cn = bem('chat');

    if (this.props.currentChat === 'none')
      return this.compile(`<div class=${cn()}></div>`, this.props);

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
                      </div>
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
