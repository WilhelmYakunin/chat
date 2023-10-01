import bem from 'bem-ts';
import store from '../../../../store/store';
import Block, { someObj } from '../../../block/block';
import Input from '../../../input/input';

import './style.sass';
import { words } from '../../../../langs';
import { changeChatAvatar } from './actions';
import { modalTypes } from '../../model';
import { IChat } from '../../../../store/model';

export default class UploadAvatarModal extends Block {
  constructor(props: someObj) {
    super({ type: 'none', ...props });
  }
  componentDidMount() {
    store.subscribe((state) => {
      state.modal.type !== 'none' && this.setProps({ type: state.modal.type });
    }, this.id);
  }

  close() {
    store.setState({ modal: { type: modalTypes.close } });
  }

  async handleAvatarInput(e: Event) {
    store.setState({ isLoad: true });
    try {
      const [file] = (e.target as HTMLInputElement).files as FileList;
      const chatId = store.getState().currentChat.id;
      const { avatar } = (await changeChatAvatar({
        file,
        chatId,
      })) as IChat;
      const newChatList = store.getState().chatList.map((el) => {
        if (el.id === chatId) el.avatar = avatar;
      });
      store.setState({ chatList: newChatList });
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
  }

  render() {
    const cn = bem('newchatmodal');

    const close = new Input({
      classInput: cn('close'),
      type: 'button',
      value: 'X',
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
    });

    const avatarInput = new Input({
      type: 'file',
      name: 'avatar',
      classInput: cn('updateInput'),
      events: [
        {
          eventName: 'change',
          callback: this.handleAvatarInput.bind(this),
        },
      ],
    });

    const abolution = new Input({
      classInput: cn('abolution'),
      type: 'button',
      value: words.modal.ABOLUTION,
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
    });

    const confirm = new Input({
      classInput: cn('confirm'),
      type: 'button',
      value: words.modal.CONFIRM,
      events: [
        {
          eventName: 'click',
          callback: (() => this.close()).bind(this),
        },
      ],
    });

    this.events = [
      {
        eventName: 'submit',
        callback: ((e: Event) => this.handleAvatarInput(e)).bind(this),
      },
    ];

    this.children.close = close;
    this.children.avatarInput = avatarInput;
    this.children.confirm = confirm;
    this.children.abolution = abolution;

    const temp = `<form class=${cn('wrapper')}>
                    <div class=${cn('header')}>
                      <h2>${words.modal.UPLOAD_AVATAR}</h2>
                      <div>
                        <% this.close %>
                      </div>
                    </div>
                    <label class=${cn('avatarWrapper')}>
                      ${words.modal.UPLOAD_AVATAR}
                      <% this.avatarInput %>    
                    </label>        
                    <div class=${cn('footer')}>
                      <% this.abolution %>
                      <% this.confirm %>
                    </div>
                  </form>`;

    return this.compile(temp, this.props);
  }
}
