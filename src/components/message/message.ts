import Block, { someObj } from '../block/block';
import store from '../../store/store';
import { words } from '../../langs';

import bem from 'bem-ts';
import './style.sass';

export default class Messages extends Block {
  constructor(props?: someObj) {
    super(props);
    store.subscribe(
      (state) =>
        state.currentChat.messages !== this.props.messages &&
        this.setProps({ messages: state.currentChat.messages }),
      this.id
    );
  }

  render() {
    if (!this.props.messages || this.props.messages?.length === 0)
      return this.compile(`<div></div>`, this.props);

    const cn = bem('messages');
    const yourId = Number(store.getState().settings.id);

    const temp = `<ul class=${cn('list')}>
                    <% for (let i = 0; i < this.messages.length; i += 1) { %>
                      <li 
                        <% if (this.messages[i].user_id === Number(${yourId})) { %>
                            class="${cn('card', { you: true })}"
                        <% } else { %>
                            class=${cn('card')}>
                        <% } %> >
                          <span class=${cn('author')}> 
                            <% if (this.messages[i].user_id === Number(${yourId})) { %>
                             ${words.CHAT_OWNER} 
                            <% } %>
                          </span>
                          <span class=${cn('content')}>
                            <%this.messages[i].content%>
                          </span>
                        </li>
                      <% } %>
                    </ul>`;

    return this.compile(temp, this.props);
  }
}
