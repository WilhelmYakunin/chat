import Block from '../block/block';
import Spinner from '../spinner/spinner';

export default class Button extends Block {
  render() {
    const className = this.props.className ?? '';

    this.children.loader = new Spinner({
      className: 'spinner-border-xs',
    });

    const temp = `
                        <button 
                            type="<% if (this.type) { %><% this.type %><% } %>" 
                            class="${className}" 
                            <% if (this.isLoading) { %>
                                disabled
                            <% } %> 
                        >
                        <% if (this.isLoading) { %>
                            <% this.loader %>
                        <% } else { %>
                            <% this.text %>
                        <% } %>
                            
                            
                        </button>
                    `;
    return this.compile(temp, this.props);
  }
}
