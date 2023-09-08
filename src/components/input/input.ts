import Block from '../block/block';

export default class Input extends Block {
  render() {
    const temp = `<input 
                    type="<% this.type %>" 
                    <% if (this.name) { %> name="<% this.name %>" <% } %> 
                    <% if (this.classInput) { %> class="<% this.classInput %>"<% } %> 
                    <% if (this.tabindex) { %> tabindex="<% this.tabindex %>"<% } %>
                    <% if (this.placeholder) { %> placeholder="<% this.placeholder %>"<% } %>
                    <% if (this.value) { %> value="<% this.value %>"<% } %>
                    <% if (this.disabled) { %> disabled <% } %>
                    <% if (this.required) { %> required <% } %>
                    >`;

    return this.compile(temp, this.props);
  }
}
