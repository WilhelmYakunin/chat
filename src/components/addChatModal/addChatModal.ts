import Block from '../block/block';
import Input from '../input/input';

import bem from 'bem-ts';
import './style.scss';
import { words } from '../../langs';

import store from '../../state';
import { addChat } from './actions';

export default class AddChatModal extends Block {
  constructor() {
    const { type, inputValue } = store.getState().modal;

    const defaultValues = {
      isLoad: false,
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

  onSubmit(e: Event) {
    this.setProps({ isLoad: true });
    e.preventDefault();

    const title = store.getState().modal.inputValue;

    try {
      addChat({ title });
      this.close();
    } catch (err) {
      console.log(err);
    } finally {
      this.setProps({ isLoad: false });
    }
  }

  render() {
    const block = bem('modal');

    const close = new Input({
      classInput: block('close'),
      type: 'button',
      value: 'X',
      disabled: this.props.isLoad,
      events: [{ eventName: 'click', callback: this.close }],
    });

    const input = new Input({
      type: 'text',
      classInput: block('input'),
      disabled: this.props.isLoad,
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
      disabled: this.props.isLoad,
      events: [
        {
          eventName: 'click',
          callback: ((e: Event) => this.onSubmit(e)).bind(this),
        },
      ],
    });

    const abolution = new Input({
      classInput: block('abolution'),
      type: 'button',
      value: words.modal.ABOLUTION,
      disabled: this.props.isLoad,
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

    const temp = `<div <% if (this.isOpen) { %> class=${block()} <% } %>  <% if (!this.show) { %> hidden <% } %> >
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
