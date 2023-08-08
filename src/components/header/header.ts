import Block from '../block/block';

export default class Header extends Block {
  render() {
    const temp = `<h2  <% if (this.class) { %> class="<% this.class %>"> <% } %> <% this.text%></h2>`;
    return this.compile(temp, this.props);
  }
}
