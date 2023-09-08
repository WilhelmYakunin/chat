import Block from '../block/block';

export default class IconedButton extends Block {
  render() {
    const temp = `<span <% if (this.class) { %> class="<% this.class %>"> <% } %> 
                    <img alt="<% this.alt %>" src="<% this.src %>"  
                </span>`;
    return this.compile(temp, this.props);
  }
}
