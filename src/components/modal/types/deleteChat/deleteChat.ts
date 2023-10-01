import bem from 'bem-ts';
import store from '../../../../store/store';
import Block from '../../../block/block';
import Input from '../../../input/input';

import './style.sass';
import { words } from '../../../../langs';
import { deletChat } from './actions';
import { modalTypes } from '../../model';

export default class DeleteChatModal extends Block {
  close() {
    store.setState({ modal: { type: modalTypes.close } });
  }

  async onDelete() {
    store.setState({ isLoad: true });
    try {
      const { id } = store.getState().currentChat;
      await deletChat(Number(id));
      store.deleteChat(id);
      store.setState({ currentChat: { id: 'none' } });
      this.close();
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
  }

  render() {
    const cn = bem('deletemodal');

    const close = new Input({
      classInput: cn('close'),
      type: 'button',
      value: 'X',
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
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
          callback: (() => this.onDelete()).bind(this),
        },
      ],
    });

    this.children.close = close;
    this.children.confirm = confirm;
    this.children.abolution = abolution;

    const temp = `<form class=${cn('wrapper')}>
                    <div class=${cn('header')}>
                      <h2>${words.modal.DELETE_CHAT}</h2>
                      <div>
                        <% this.close %>
                      </div>
                    </div>
                      ${words.modal.DELETE_CHAT_QUESTION}           
                    <div class=${cn('footer')}>
                      <% this.abolution %>
                      <% this.confirm %>
                    </div>
                  </form>`;

    return this.compile(temp, this.props);
  }
}
