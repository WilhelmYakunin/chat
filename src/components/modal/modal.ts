import bem from 'bem-ts';
import store from '../../store/store';
import Block, { someObj } from '../block/block';
import AddNewChat from './types/addNewChat/addNewChat';
import LogoutModal from './types/logout/logout';

import './style.sass';
import { modalTypes } from './model';
import DeleteChatModal from './types/deleteChat/deleteChat';
import changeChatAvatar from './types/changeChatAvatar/changeChatAvatar';
import ChangePasswordModal from './types/chagePassword/changePassword';

export default class Modal extends Block {
  constructor(props: someObj) {
    super({ type: 'none', ...props });
  }

  componentDidMount() {
    store.subscribe((state) => {
      state.modal.type !== this.props.type &&
        this.setProps({ type: state.modal.type });
    }, this.id);
  }

  render() {
    const cn = bem('modal');

    const { type } = this.props;
    const getChild = (): { name: string; Child: typeof Block } => {
      switch (type) {
        case modalTypes.addChat:
          return { name: modalTypes.addChat, Child: AddNewChat };
        case modalTypes.logout:
          return { name: modalTypes.logout, Child: LogoutModal };
        case modalTypes.deleteChat:
          return { name: modalTypes.deleteChat, Child: DeleteChatModal };
        case modalTypes.changeChatAvatar:
          return { name: modalTypes.changeChatAvatar, Child: changeChatAvatar };
        case modalTypes.chagePassword:
          return { name: modalTypes.chagePassword, Child: ChangePasswordModal };
        default:
          return { name: modalTypes.addChat, Child: AddNewChat };
      }
    };

    const { name, Child } = getChild();
    this.children[name] = new Child();

    const temp = `<div <% if (this.type !== 'none') { %> class=${cn()} <% } %>  <% if (this.type === 'none') { %> hidden <% } %> >
                    <% this.${name} %>
                  </div>`;

    return this.compile(temp, this.props);
  }
}
