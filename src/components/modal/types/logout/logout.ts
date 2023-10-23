import bem from 'bem-ts';
import store from '../../../../store/store';
import Block from '../../../block/block';
import Input from '../../../input/input';

import './style.sass';
import { words } from '../../../../langs';
import { logOut } from './actions';
import { modalTypes } from '../../model';
import router from '../../../../router/routerInit';
import { routes } from '../../../../router/routes';

export default class LogoutModal extends Block {
  close() {
    store.setState({ modal: { type: modalTypes.close } });
  }

  async logout() {
    try {
      await logOut();
      store.setState({ isAuth: false });
      router.go(routes.sigin());
      this.close();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const cn = bem('logoutmodal');

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
          callback: (() => this.logout()).bind(this),
        },
      ],
    });

    this.children.close = close;
    this.children.confirm = confirm;
    this.children.abolution = abolution;

    const temp = `<form class=${cn('wrapper')}>
                    <div class=${cn('header')}>
                      <h2>${words.modal.LOGOUT}</h2>
                      <div>
                        <% this.close %>
                      </div>
                    </div>
                      ${words.modal.LOGOUT_QUESTION}           
                    <div class=${cn('footer')}>
                      <% this.abolution %>
                      <% this.confirm %>
                    </div>
                  </form>`;

    return this.compile(temp, this.props);
  }
}
