import Header from '../../components/header/header';
import Input from '../../components/input/input';
import LabeledInput from '../../components/labeledInput/LabeledInput';
import ErrMessage from '../../components/errMessage/ErrMessage';
import { getUserInfo } from './service';
import { words } from '../../langs/index';
import { routes } from '../../router/routes';

import { User, userInfoFields } from './model';

import './style.scss';
import bem from 'bem-ts';
import Block, { someObj } from '../../components/block/block';

import router from '../../router/router';
import store from '../../state';

const block = bem('settings');

export default class SettingsPage extends Block {
  constructor(props: someObj) {
    const errors: someObj = {
      login: false,
      old_password: false,
      new_password: false,
    };

    const defaultValues = {
      avatar: store.getState().settings.avatar,
      id: store.getState().settings.id,
      first_name: store.getState().settings.first_name,
      last_name: store.getState().settings.last_name,
      display_name: store.getState().settings.display_name,
      login: store.getState().settings.login,
      password: store.getState().settings.old_password,
      email: store.getState().settings.email,
      phone: store.getState().settings.phone,

      isAtSet: store.getState().settings.isAtSet,
      isLoading: store.getState().settings.isLoading,
      errors: {
        first_name: false,
        second_name: false,
        display_name: false,
        login: false,
        email: false,
        old_password: false,
        new_password: false,
        phone: false,
      },
    };

    const propsAndChildren = { ...props, ...errors, ...defaultValues };

    super(propsAndChildren);
  }

  componentDidMount() {
    console.log(this.getInitInfo().then((d) => console.log(d)));
    store.subscribe((state) => {
      this.setProps({
        isSipup: state.signup.isSignup,
        login: state.signup.login,
        password: state.signup.password,
      });
    }, 'settings');
  }

  async getInitInfo() {
    this.setProps({ isLoading: true });
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

    const data = Object.keys(userInfoFields).reduce((acc, fieldName) => {
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

    // await getUserInfo()
    //   .then(() => {
    //     this.setProps({ isSignup: false });
    //     router.go(routes.messenger());
    //   })
    //   .catch((err) => alert(err.reason))
    //   .finally(() => {
    //     this.setProps({ isSignup: false });
    //   });
  }

  goBack(e: Event) {
    e.preventDefault();
    router.go(routes.messenger());
  }

  render() {
    const header = new Header({ class: block('header'), text: words.PROFILE });

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
              type:
                fieldName ===
                (userInfoFields.old_password || userInfoFields.new_password)
                  ? 'password'
                  : 'text',
              name: words.inputs[fieldName].name,
              classInput: block('input'),
              tabindex: fieldName === userInfoFields.first_name && 1,
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

    const applyBtn = new Input({
      type: 'submit',
      classInput: block('applyButton'),
      value: words.APPLY_CHANGES,
      disabled: this.props.isSignup,
    });

    const gobackLink = new Input({
      type: 'button',
      classInput: block('gobackLink'),
      value: words.TO_HOME,
      events: [
        {
          eventName: 'click',
          callback: this.goBack,
        },
      ],
    });

    this.children.header = header;
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
        callback: ((e: Event) => this.handleSignin(e)).bind(this),
      },
    ];

    const ctx = this.children;
    const temp = `<div class=${block()}> 
                    <form class=${block('wrapper')} >
                        <% this.header %>
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

// import { getImageUrl } from '../../components/helpers';

// import { words, PATTERTNS, PLACEHOLDER } from '../../langs/index';

// import { User, userInfoFields } from './model';
// import { validateInput } from '../../components/helpers/validate';
// import { getUserInfo, userFormSchema } from './service';

// import './style.scss';
// import bem from 'bem-ts';
// import Block from '../../components/block/block';
// import {
//   formTemplate,
//   inputTemplate,
//   labelTemplate,
//   patternTemplate,
//   submitBtnTemplate,
// } from './templates';

// const block = bem('user');

// const userPage = () => {
//   // const userInfo = getUserInfo();
//   // console.log(userInfo.then((data) => console.log(data)));
//   const avatar = new Block('div', {
//     template: `<div class={{class}}>
//     <img alt='user depiction' src={{iconlink}}></img>
//     </div>`,
//     data: {
//       class: block('avatar'),
//       iconlink: getImageUrl('/pictures/test_ico.png'),
//     },
//   });

//   const changeAvatarLabel = new Block('label', {
//     template: `<label for={{forAttr}} class={{class}}>
//     {{{label}}}
//       <input class={{inutclass}} type='file' accept='imgae/png' multiple name='avatar'></input>
//     </label>`,
//     data: {
//       forAttr: 'avatar',
//       label: words.CHANGE_AVATAR,
//       class: block('inputChangeAvatar'),
//     },
//   });

//   const header = new Block('h2', {
//     template: '<h2 class={{class}}>{{text}}</h2>',
//     data: { class: block('header'), text: words.PROFILE },
//   });

//   const changeAvatar = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('changeAvatarWrapper') },
//     children: [header, changeAvatarLabel],
//   });

//   const headerContainer = new Block('div', {
//     template: '<div class={{class}}></div>',
//     data: { class: block('headerContainer') },
//     children: [avatar, changeAvatar],
//   });

//   const fields = [];
//   for (const key in userInfoFields) {
//     const input = new Block('input', {
//       template: inputTemplate,
//       data: {
//         name: userInfoFields[key as keyof typeof userInfoFields],
//         class: block('input'),
//         placeholder: PLACEHOLDER[key as keyof typeof userInfoFields],
//         tabIndex: key === 'first_name' && '1',
//       },
//       events: [
//         {
//           eventName: 'blur',
//           callback: (e: Event) =>
//             validateInput({
//               target: e.target as HTMLElement,
//               rule: userFormSchema[key as keyof typeof userInfoFields].pattern,
//             }),
//         },
//       ],
//     });

//     const pattern = new Block('span', {
//       template: patternTemplate,
//       data: {
//         class: block('pattern'),
//         text: PATTERTNS[key.toUpperCase() as keyof typeof userInfoFields],
//       },
//     });

//     const lable = new Block('label', {
//       template: labelTemplate,
//       data: {
//         forAttr: userInfoFields[key as keyof typeof userInfoFields],
//         labelClass: block('label'),
//       },
//       children: [input, pattern],
//     });

//     fields.push(lable);
//   }

//   const applyChangesBtn = new Block('input', {
//     template: submitBtnTemplate,
//     data: {
//       type: 'submit',
//       class: block('applyChangesButton'),
//       value: words.APPLY_CHANGES,
//     },
//   });

//   fields.push(applyChangesBtn);
//   const userForm = new Block('form', {
//     template: formTemplate,
//     data: { class: block('wrapper') },
//     children: fields,
//     events: [
//       {
//         eventName: 'submit',
//         callback: (e: Event): void => {
//           e.preventDefault();
//           const data: { [x: string]: unknown } = {};
//           for (const key in userFormSchema) {
//             const el = (e.target as HTMLFormElement).elements[
//               key as keyof HTMLFormControlsCollection
//             ];
//             data[key] = (el as unknown as HTMLInputElement).value;
//             validateInput({
//               target: el as HTMLElement,
//               rule: userFormSchema[key].pattern,
//             });
//           }

//           console.log(data);
//         },
//       },
//     ],
//   });

//   const userProfileContainer = new Block('div', {
//     children: [headerContainer, userForm],
//   });

//   return userProfileContainer;
// };

// export default userPage;
