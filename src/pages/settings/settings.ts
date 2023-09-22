import BackwardsMobileBotton from '../../components/backwardsMobileBotton/backwardsMobileButton';
import Header from '../../components/header/header';
import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import ErrMessage from '../../components/errMessage/ErrMessage';
import {
  changeUserAvatar,
  changeUserInfo,
  getAvatar,
  getProperType,
  getUserInfo,
} from './actions';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import { User, UserDTO, requiredFileds, userInfoFields } from './model';

import './style.sass';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/router';
import store from '../../store/store';

const block = bem('settings');

export default class SettingsPage extends Block {
  constructor(props: someObj) {
    const {
      avatar,
      id,
      first_name,
      second_name,
      display_name,
      login,
      email,
      phone,
      errors,
    } = store.getState().settings;

    const defaultValues = {
      avatar,
      id,
      first_name,
      second_name,
      display_name,
      login,
      email,
      phone,
      errors: {
        first_name: errors.first_name,
        second_name: errors.second_name,
        display_name: errors.display_name,
        login: errors.login,
        email: errors.email,
        old_password: errors.old_password,
        new_password: errors.new_password,
        phone: errors.phone,
      },
    };

    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren);
    this.setUserInfo();
  }

  async setUserInfo() {
    store.setState({ isLoad: true });
    try {
      const {
        avatar,
        login,
        display_name,
        email,
        first_name,
        second_name,
        id,
        phone,
      }: User = await getUserInfo();
      this.setProps({
        avatar,
        login,
        display_name,
        email,
        first_name,
        second_name,
        id,
        phone,
      });
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
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

  async handleAvatarInput(e: Event) {
    store.setState({ isLoad: true });
    try {
      const [file] = (e.target as HTMLInputElement).files as FileList;

      this.setProps({ isLoading: true });
      const { avatar } = (await changeUserAvatar(file)) as User;
      this.setProps({ avatar });
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
  }

  async handleChanges(e: Event): Promise<void> {
    store.setState({ isLoad: true });
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = Object.keys(userInfoFields).reduce(
      (acc, fieldName) => {
        const value = form[fieldName].value;
        this.validate(fieldName, value);
        (acc as UserDTO)[fieldName as keyof UserDTO] = value;
        return acc;
      },
      {
        login: this.props.display_name,
        email: this.props.email,
        first_name: this.props.first_name,
        second_name: this.props.second_name,
        display_name: this.props.display_name,
        phone: this.props.phone,
      }
    );

    if (this.props.errors) {
      const requiredFiledsErrState = {
        first_name: this.props.errors.first_name,
        second_name: this.props.errors.second_name,
        display_name: this.props.errors.display_name,
        login: this.props.errors.login,
        email: this.props.errors.email,
        phone: this.props.errors.phone,
      };

      const requiredFieldMessage = Object.entries(
        requiredFiledsErrState
      ).reduce((acc: string, [key, value]): string => {
        if (value) acc += key + ' ';
        return acc;
      }, ' ');

      const isValid = await Object.values(requiredFiledsErrState).every(
        (value) => value === false
      );
      if (!isValid)
        return alert(words.FILL_ALL_REQUIRED + requiredFieldMessage);
    }

    try {
      await changeUserInfo(data as UserDTO);
      router.go(routes.messenger());
    } catch (err) {
      console.log(err);
    } finally {
      store.setState({ isLoad: false });
    }
  }

  goBack(e: Event) {
    e.preventDefault();
    console.log(111);
    router.go(routes.messenger());
  }

  render() {
    const backwardsMobile = new BackwardsMobileBotton({
      class: block('backwardsTouchButton'),

      events: [
        {
          eventName: 'click',
          callback: this.goBack,
        },
      ],
    });

    const header = new Header({ class: block('header'), text: words.PROFILE });
    const requiredFields = Object.keys(requiredFileds);

    const [
      first_name,
      second_name,
      display_name,
      login,
      email,
      old_password,
      new_password,
      phone,
    ] = Object.keys(userInfoFields).map(
      (fieldName: string) =>
        new LabeledInput({
          classLabel: block('label'),
          forAttr: words.inputs[fieldName].name,
          children: {
            input: new Input({
              type: getProperType(fieldName),
              name: words.inputs[fieldName].name,
              classInput: block('input'),
              tabindex: fieldName === userInfoFields.first_name && 1,
              placeholder: words.inputs[fieldName].placeholder,
              value: this.props[fieldName],
              required: requiredFields.includes(fieldName),
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
              noErrClass: block('rule'),
              errorClass: block('rule', { show: true }),
            }),
          },
        })
    );

    const applyBtn = new Input({
      type: 'submit',
      classInput: block('applyButton'),
      value: words.APPLY_CHANGES,
      disabled: this.props.isLoading,
    });

    const gobackLink = new Input({
      type: 'button',
      classInput: block('gobackLink'),
      value: words.TO_HOME,
      disabled: this.props.isLoading,

      events: [
        {
          eventName: 'click',
          callback: this.goBack,
        },
      ],
    });

    const avatarInput = new Input({
      type: 'file',
      classInput: block('updateInput'),
      events: [
        {
          eventName: 'change',
          callback: this.handleAvatarInput.bind(this),
        },
      ],
    });

    this.children.backwardsMobile = backwardsMobile;
    this.children.header = header;
    this.children.avatarInput = avatarInput;
    this.children.first_name = first_name;
    this.children.second_name = second_name;
    this.children.display_name = display_name;
    this.children.login = login;
    this.children.email = email;
    this.children.old_password = old_password;
    this.children.new_password = new_password;
    this.children.phone = phone;
    this.children.applyBtn = applyBtn;
    this.children.gobackLink = gobackLink;

    this.events = [
      {
        eventName: 'submit',
        callback: ((e: Event) => this.handleChanges(e)).bind(this),
      },
    ];

    const ctx = this.children;
    const temp = `<div class=${block()}> 
                    <form class=${block('wrapper')}>
                        <div class=${block('headerWrapper')}>
                        <% this.backwardsMobile %>
                        <% this.header %>
                        </div>
                        <label class=${block('avatarWrapper')}>
                          <img alt=${words.AVATAR_ALT} class=${block('avatar')} 
                          src=${getAvatar(this.props.avatar as string)} />
                          <span>${words.inputs.avatar.placeholder}</span>
                          <% this.avatarInput %>
                        </label>
                        <% this.first_name %>
                        <% this.second_name %>
                        <% this.display_name %>
                        <% this.login %>
                        <% this.email %>
                        <% this.old_password %>
                        <% this.new_password %>
                        <% this.phone %>
                        <% this.applyBtn %>
                        <% this.gobackLink %>
                    </form>
                  </div>`;
    return this.compile(temp, ctx);
  }
}
