import Block from '../block/block';

export default class SpanError extends Block {
  render() {
    const temp =
      '<span class="<% this.hasError ? this.errorClass : this.noErrClass %>"><% this.rule %></span>';

    return this.compile(temp, this.props);
  }
}
