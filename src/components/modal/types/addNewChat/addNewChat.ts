import bem from 'bem-ts';
import store from '../../../../store/store';
import Block, { someObj } from '../../../block/block';
import Input from '../../../input/input';

import './style.sass';
import { words } from '../../../../langs';
import { addChat } from './actions';
import { getChats } from '../../../../pages/messenger/actions';
import { modalTypes } from '../../model';

export default class NewChatModal extends Block {
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

  handleInput(e: Event) {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value;
    this.setProps({ inputValue: value });
    store.setState({ modal: { inputValue: value } });
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    const title = store.getState().modal.inputValue;
    if (title === '' || title.match(/^\s+$/)) {
      return this.close();
    }

    store.setState({ isLoad: true });

    try {
      await addChat(title);
      const chatList = await getChats();
      store.setState({ chatList });
      this.close();
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

    const input = new Input({
      type: 'text',
      classInput: cn('input'),
      name: 'title',
      required: true,
      value: this.props.inputValue,
      placeholder: words.modal.ADD_CHAT_PLACEHOLDER,
      events: [
        {
          eventName: 'blur',
          callback: ((e: Event) => this.handleInput(e)).bind(this),
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
          callback: ((e: Event) => this.onSubmit(e)).bind(this),
        },
      ],
    });

    this.events = [
      {
        eventName: 'submit',
        callback: ((e: Event) => this.onSubmit(e)).bind(this),
      },
    ];

    this.children.close = close;
    this.children.input = input;
    this.children.confirm = confirm;
    this.children.abolution = abolution;

    const temp = `<form class=${cn('wrapper')}>
                    <div class=${cn('header')}>
                      <h2>${words.modal.ADD_CHAT}</h2>
                      <div>
                        <% this.close %>
                      </div>
                    </div>
                    <% this.input %>            
                    <div class=${cn('footer')}>
                      <% this.abolution %>
                      <% this.confirm %>
                    </div>
                  </form>`;

    return this.compile(temp, this.props);
  }
}
