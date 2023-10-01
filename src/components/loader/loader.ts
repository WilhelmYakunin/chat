import Block from '../block/block';
import bem from 'bem-ts';

import './style.sass';
import store from '../../store/store';

export default class ChatList extends Block {
  componentDidMount() {
    store.subscribe((state) => {
      if (state.isLoad !== this.props.isLoad)
        this.setProps({ isLoad: state.isLoad });
    }, this.id);
  }

  render() {
    const cn = bem('loader');

    const temp = `<div <% if (this.isLoad) { %> 
                          class=${cn('container')} 
                    <% } %>  <% if (!this.isLoad) { %> hidden <% } %> >
                    <span class=${cn()}> </span>`;

    return this.compile(temp, this.props);
  }
}
