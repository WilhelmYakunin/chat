import Block from '../block/block';
import Input from '../input/input';

import bem from 'bem-ts';
import './style.scss';
import { words } from '../../langs';

import store from '../../store/store';
import { addChat } from './actions';
import { getChats } from '../../pages/messenger/actions';

export default class AddChatModal extends Block {
  constructor() {
    const { type, inputValue } = store.getState().modal;

    const defaultValues = {
      isOpen: type === 'addChatModal',
      inputValue,
    };

    const propsAndChildren = { ...defaultValues };

    super(propsAndChildren);
  }

  componentDidMount() {
    store.subscribe((state) => {
      if (state.modal.type !== 'addChatModal') this.setProps({ isOpen: false });
    }, this.id);
  }

  close() {
    store.setState({ modal: { type: 'none', inputValue: '' } });
  }

  handleInput(e: Event) {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value;
    this.setProps({ inputValue: value });
    store.setState({ modal: { inputValue: value } });
  }

  async onSubmit(e: Event) {
    store.setState({ isLoad: true });
    e.preventDefault();

    const title = store.getState().modal.inputValue;

    try {
      await addChat({ title });
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
    const block = bem('modal');

    const close = new Input({
      classInput: block('close'),
      type: 'button',
      value: 'X',
      events: [{ eventName: 'click', callback: this.close }],
    });

    const input = new Input({
      type: 'text',
      classInput: block('input'),
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

    const confirm = new Input({
      classInput: block('confirm'),
      type: 'button',
      value: words.modal.CONFIRM,
      events: [
        {
          eventName: 'click',
          callback: ((e: Event) => this.onSubmit(e)).bind(this),
        },
        {
          eventName: 'submit',
          callback: ((e: Event) => this.onSubmit(e)).bind(this),
        },
      ],
    });

    const abolution = new Input({
      classInput: block('abolution'),
      type: 'button',
      value: words.modal.ABOLUTION,
      events: [{ eventName: 'click', callback: this.close }],
    });

    this.children.close = close;
    this.children.input = input;
    this.children.confirm = confirm;
    this.children.abolution = abolution;

    this.events = [
      {
        eventName: 'submit',
        callback: ((e: Event) => this.onSubmit(e)).bind(this),
      },
    ];

    const temp = `<div <% if (this.isOpen) { %> class=${block()} <% } %>  <% if (!this.isOpen) { %> hidden <% } %> >
                    <form class=${block('container')} class=${block('form')}>
                        <div class=${block('header')} >
                          <% this.close %>
                        </div>
                        <% this.input %>
                        <div class=${block('footer')}>
                          <% this.confirm %>
                          <% this.abolution %>
                      </div>
                    </form>
                  </div>`;

    return this.compile(temp, this.props);
  }
}
