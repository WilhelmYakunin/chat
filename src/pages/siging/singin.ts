import Header from '../../components/header/header';
import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import ErrMessage from '../../components/errMessage/ErrMessage';
import { login } from './service';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import { loginFields } from './model';

import './style.scss';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/router';
import store from '../../state';

const block = bem('signin');
export default class Login extends Block {
  constructor(props: someObj) {
    const errors: someObj = { login: false, password: false };

    const defaultValues = {
      login: store.getState().signin.login,
      password: store.getState().signin.password,
      isLogging: store.getState().signin.isLogging,
      errors: { login: false, password: false },
    };

    const propsAndChildren = { ...props, ...errors, ...defaultValues };

    super(propsAndChildren);
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        isLogging: state.signin.isLogging,
      });
    }, 'user');
  }

  validate(fieldName: string, value: string) {
    const error = value.match(words.inputs[fieldName].matchPttern);
    !error
      ? this.setProps({ errors: { [fieldName]: true } })
      : this.setProps({ errors: { [fieldName]: false } });
  }

  handleInput(e: Event, fieldName: string) {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value;
    this.setProps({ [fieldName]: value });
    store.setState({ signin: { [fieldName]: value } });
    this.validate(fieldName, value);
  }

  async handleSignin(e: Event): Promise<void> {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    type ILogin = { login: string; password: string };

    const data = Object.keys(loginFields).reduce((acc, fieldName) => {
      const value = form[fieldName].value;
      this.validate(fieldName, value);
      (acc as ILogin)[fieldName as keyof ILogin] = value;
      return acc;
    }, {});

    if (this.props.errors) {
      const isValid = Object.values(this.props.errors).every(
        (value) => value === true
      );
      if (isValid) return;
    }

    this.setProps({ isLogging: true });

    await login(data as ILogin)
      .then(() => {
        this.setProps({ isLogging: false });
        router.go(routes.messenger());
      })
      .catch((err) => alert(err.reason))
      .finally(() => {
        this.setProps({ isLogging: false });
      });
  }

  goSignup(e: Event) {
    e.preventDefault();
    router.go(routes.singup());
  }

  render() {
    const header = new Header({ class: block('header'), text: words.SIGN_IN });

    const [login, password] = Object.keys(loginFields).map(
      (fieldName: string) =>
        new LabeledInput({
          classLabel: block('label'),
          forAttr: words.inputs[fieldName].name,
          children: {
            input: new Input({
              type: fieldName === loginFields.password ? 'password' : 'text',
              name: words.inputs[fieldName].name,
              classInput: block('input'),
              tabindex: fieldName === loginFields.login && 1,
              placeholder: words.inputs[fieldName].placeholder,
              value: this.props[fieldName],
              disabled: this.props.isLogging,
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
              noErrClass: block('rule'),
              errorClass: block('rule', { show: true }),
            }),
          },
        })
    );

    const signInBtn = new Input({
      type: 'submit',
      classInput: block('authButton'),
      value: words.SIGN_IN,
      disabled: this.props.isLogging,
    });

    const sigUpLink = new Input({
      type: 'button',
      classInput: block('signupLink'),
      value: words.SIGN_UP,
      events: [
        {
          eventName: 'click',
          callback: this.goSignup,
        },
      ],
    });

    this.children.header = header;
    this.children.login = login;
    this.children.password = password;
    this.children.button = signInBtn;
    this.children.sigUpLink = sigUpLink;

    this.events = [
      {
        eventName: 'submit',
        callback: ((e: Event) => this.handleSignin(e)).bind(this),
      },
    ];

    const ctx = this.children;
    const temp = `<div class=${block()}> 
                    <form class=${block('wrapper')} >
                        <% this.header %>
                        <% this.login %>
                        <% this.password %>
                        <% this.button %>
                    </form>
                    <aside class=${block('aside')}>
                      <span>${words.NO_ACCOUNT}</span>
                      <% this.sigUpLink %>
                    </aside>
                  </div>`;
    return this.compile(temp, ctx);
  }
}
