import bem from 'bem-ts';
import store from '../../../../store/store';
import Block, { someObj } from '../../../block/block';
import Input from '../../../input/input';
import { words } from '../../../../langs';
import { chagePasswrod } from './actions';
import { modalTypes } from '../../model';
import { changePasswordFields } from './model';
import LabeledInput from '../../../labeledInput/LabeledInput';
import { getProperType } from '../../../../pages/settings/actions';
import ErrMessage from '../../../errMessage/ErrMessage';

import './style.sass';

export default class ChangePasswordModal extends Block {
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

  validate(fieldName: string, value: string) {
    const regexp = new RegExp(words.inputs[fieldName].matchPttern);
    const error = value.match(regexp);

    !error
      ? this.setProps({ errors: { [fieldName]: true } })
      : this.setProps({ errors: { [fieldName]: false } });
  }

  handleInput(e: Event, fieldName: string) {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value;

    this.setProps({ [fieldName]: value });
    store.setState({ settings: { [fieldName]: value } });
    this.validate(fieldName, value);
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    console.log(e.target);
    const oldPassword = form[changePasswordFields.old_password].value;
    const newPassword = form[changePasswordFields.new_password].value;

    if (oldPassword !== newPassword) {
      return this.setProps({
        errors: { [changePasswordFields.old_password]: true },
      });
    } else {
      this.setProps({ errors: { [changePasswordFields.old_password]: false } });
    }

    store.setState({ isLoad: true });
    try {
      await chagePasswrod({ oldPassword, newPassword });
      this.close();
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
  }

  render() {
    const cn = bem('changepasswordmodal');

    const close = new Input({
      classInput: cn('close'),
      type: 'button',
      value: 'X',
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
    });

    const [old_password, new_password] = Object.keys(changePasswordFields).map(
      (fieldName: string) =>
        new LabeledInput({
          classLabel: cn('label'),
          forAttr: words.inputs[fieldName].name,
          children: {
            input: new Input({
              type: 'password',
              name: words.inputs[fieldName].name,
              classInput: cn('input'),
              tabindex: fieldName === changePasswordFields.old_password && 1,
              placeholder: words.inputs[fieldName].placeholder,
              value: this.props[fieldName],
              required: true,
              disabled: this.props.isLoading,
              events: [
                {
                  eventName: 'blur',
                  callback: ((e: Event) => this.handleInput(e, fieldName)).bind(
                    this
                  ),
                },
              ],
            }),
            error: new ErrMessage({
              hasError: this.props.errors?.[fieldName],
              rule: words.inputs[fieldName].rule,
              noErrClass: cn('rule'),
              errorClass: cn('rule', { show: true }),
            }),
          },
        })
    );

    const abolution = new Input({
      classInput: cn('abolution'),
      type: 'button',
      value: words.modal.ABOLUTION,
      events: [{ eventName: 'click', callback: this.close.bind(this) }],
    });

    const confirm = new Input({
      classInput: cn('confirm'),
      type: 'submit',
      value: words.modal.CONFIRM,
      events: [
        {
          eventName: 'submit',
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
    this.children.old_password = old_password;
    this.children.new_password = new_password;
    this.children.confirm = confirm;
    this.children.abolution = abolution;

    const temp = `<form class=${cn('wrapper')}>
                    <div class=${cn('header')}>
                      <h2>${words.modal.CHAGE_PASSWORD}</h2>
                      <div>
                        <% this.close %>
                      </div>
                    </div>
                      <% this.old_password %>
                      <% this.new_password %>          
                    <div class=${cn('footer')}>
                      <% this.abolution %>
                      <% this.confirm %>
                    </div>
                  </form>`;

    return this.compile(temp, this.props);
  }
}
