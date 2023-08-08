import Header from '../../components/header/header';
import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import ErrMessage from '../../components/errMessage/ErrMessage';
import { sigUp } from './service';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import { signupFields } from './model';

import './style.scss';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/router';
import store from '../../state';

const block = bem('signup');

export default class Login extends Block {
  constructor(props: someObj) {
    const errors: someObj = {
      login: false,
      password: false,
      password_confirm: false,
    };

    const defaultValues = {
      login: store.getState().signup.login,
      password: store.getState().signup.password,
      isSipup: store.getState().signup.isSignup,
      errors: {
        email: false,
        first_name: false,
        login: false,
        password: false,
        password_confirm: false,
        phone: false,
        second_name: false,
      },
    };

    const propsAndChildren = { ...props, ...errors, ...defaultValues };

    super(propsAndChildren);
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        isSipup: state.signup.isSignup,
        login: state.signup.login,
        password: state.signup.password,
      });
    }, 'sigup');
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
    store.setState({ signin: { [fieldName]: value } });
    this.validate(fieldName, value);
  }

  async handleSignin(e: Event): Promise<void> {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    type ISignup = {
      first_name: string;
      second_name: string;
      login: string;
      password: string;
      email: string;
      phone: string;
    };

    const data = Object.keys(signupFields).reduce((acc, fieldName) => {
      const value = form[fieldName].value;
      this.validate(fieldName, value);
      (acc as ISignup)[fieldName as keyof ISignup] = value;
      return acc;
    }, {});

    if (this.props.errors) {
      const isValid = await Object.values(this.props.errors).every(
        (value) => value === true
      );
      if (!isValid) return;
    }

    this.setProps({ isSignup: true });

    await sigUp(data as ISignup)
      .then(() => {
        this.setProps({ isSignup: false });
        router.go(routes.messenger());
      })
      .catch((err) => alert(err.reason))
      .finally(() => {
        this.setProps({ isSignup: false });
      });
  }

  goSignin(e: Event) {
    e.preventDefault();
    router.go(routes.login());
  }

  render() {
    const header = new Header({ class: block('header'), text: words.SIGN_UP });

    const [
      first_name,
      second_name,
      login,
      email,
      password,
      password_confirm,
      phone,
    ] = Object.keys(signupFields).map(
      (fieldName: string) =>
        new LabeledInput({
          classLabel: block('label'),
          forAttr: words.inputs[fieldName].name,
          children: {
            input: new Input({
              type:
                fieldName ===
                (signupFields.password || signupFields.password_confirm)
                  ? 'password'
                  : 'text',
              name: words.inputs[fieldName].name,
              classInput: block('input'),
              tabindex: fieldName === signupFields.first_name && 1,
              placeholder: words.inputs[fieldName].placeholder,
              value: this.props[fieldName],
              disabled: this.props.isSignup,
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
      value: words.SIGN_UP,
      disabled: this.props.isSignup,
    });

    const sigUpLink = new Input({
      type: 'button',
      classInput: block('signupLink'),
      value: words.SIGN_IN,
      events: [
        {
          eventName: 'click',
          callback: this.goSignin,
        },
      ],
    });

    this.children.header = header;
    this.children.first_name = first_name;
    this.children.second_name = second_name;
    this.children.login = login;
    this.children.email = email;
    this.children.password = password;
    this.children.password_confirm = password_confirm;
    this.children.phone = phone;
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
                        <% this.first_name %>
                        <% this.second_name %>
                        <% this.login %>
                        <% this.email %>
                        <% this.password %>
                        <% this.password_confirm %>
                        <% this.phone %>
                        <% this.button %>
                    </form>
                    <aside class=${block('aside')}>
                      <span>${words.IS_ACCOUNT}</span>
                      <% this.sigUpLink %>
                    </aside>
                  </div>`;
    return this.compile(temp, ctx);
  }
}
