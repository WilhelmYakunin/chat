import bem from 'bem-ts';
import Block from '../../components/block/block';
import { words } from '../../langs/index';
import router from '../../router/routerInit';

import './style.sass';
import Input from '../../components/input/input';

const block = bem('notfound');
export default class NotFoundPage extends Block {
  goBack(e: Event) {
    e.preventDefault();
    router.back();
  }

  render(): HTMLElement | DocumentFragment {
    const goBackLink = new Input({
      type: 'button',
      classInput: block('backNavigate'),
      value: words.TO_HOME,
      events: [
        {
          eventName: 'click',
          callback: this.goBack,
        },
      ],
    });

    this.children.goBack = goBackLink;
    const ctx = this.children;

    const temp = `<div class=${block('container')}>
                    <span>404</span>
                    <span>${words.NOT_FOUND}</span>
                    <% this.goBack %>
                  </div>`;

    return this.compile(temp, ctx);
  }
}
