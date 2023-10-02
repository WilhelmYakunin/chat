import bem from 'bem-ts';
import Input from '../../components/input/input';
import { words } from '../../langs/index';
import router from '../../router/routerInit';
import Block from '../../components/block/block';

import './style.sass';

const block = bem('servererror');
export default class ServerErrorPage extends Block {
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
                        <span>${words.SERVER_ERROR_NUMBER}</span>
                        <span>${words.SERVER_ERROR}</span>
                        <% this.goBack %>
                      </div>`;

    return this.compile(temp, ctx);
  }
}
