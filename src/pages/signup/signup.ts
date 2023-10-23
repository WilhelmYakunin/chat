import Header from '../../components/header/header';
import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import ErrMessage from '../../components/errMessage/ErrMessage';
import { getProperType, sigUp } from './actions';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import { signupFields } from './model';

import './style.sass';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/routerInit';
import store from '../../store/store';
import { requiredFileds } from '../settings/model';

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
      const requiredFiledsErrState = {
        first_name: this.props.errors.first_name,
        second_name: this.props.errors.second_name,
        password: this.props.errors.password,
        login: this.props.errors.login,
        email: this.props.errors.email,
        phone: this.props.errors.phone,
      };

      const message = Object.entries(requiredFiledsErrState).reduce(
        (acc: string, [key, value]): string => {
          if (value) acc += key + ' ';
          return acc;
        },
        ' '
      );

      const isValid = await Object.values(requiredFiledsErrState).every(
        (value) => value === false
      );
      if (!isValid) return alert(words.FILL_ALL_REQUIRED + message);
    }

    store.setState({ isLload: true });

    try {
      await sigUp(data as ISignup);
      router.go(routes.messenger());
    } catch (err: unknown) {
      if ((err as { reason: string }).reason === 'User already in system')
        return router.go(routes.messenger());
      console.log(err);
    } finally {
      store.setState({ isLload: false });
    }
  }

  goSignin(e: Event) {
    e.preventDefault();
    router.go(routes.sigin());
  }

  render() {
    const header = new Header({ class: block('header'), text: words.SIGN_UP });
    const requiredFields = Object.keys(requiredFileds);

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
              type: getProperType(fieldName),
              name: words.inputs[fieldName].name,
              classInput: block('input'),
              tabindex: fieldName === signupFields.first_name && 1,
              placeholder: words.inputs[fieldName].placeholder,
              value: this.props[fieldName],
              required: requiredFields.includes(fieldName),
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
