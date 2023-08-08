import Block from '../block/block';

export default class LabeledInput extends Block {
  render() {
    if (this.props.children?.input) {
      this.children.input = this.props.children.input;
    }

    if (this.props.children?.error) {
      this.children.error = this.props.children.error;
    }

    const temp = `<label for="<% this.forAttr %>"  
                    <% if (this.classLabel) { %>
                      class="<% this.classLabel %>">
                    <% } %>
                    <% if (this.input) { %>
                     <% this.input %>
                    <% } %>
                    <% if (this.error) { %>
                      <% this.error %>
                     <% } %>
                  </label>`;

    return this.compile(temp, this.props);
  }
}
