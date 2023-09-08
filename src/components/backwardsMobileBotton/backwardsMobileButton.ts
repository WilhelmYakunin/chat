import Block from '../block/block';

export default class BackwardsMobileBotton extends Block {
  render() {
    const temp = `<span <% if (this.class) { %> class="<% this.class %>"> <% } %> <% this.text%></span>`;
    return this.compile(temp, this.props);
  }
}
