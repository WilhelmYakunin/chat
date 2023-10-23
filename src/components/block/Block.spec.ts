import { expect } from 'chai';
import Block from './block';

class TestBlock extends Block {
  render() {
    const temp = `<h2 <% if (this.class) {%> class="<%this.class%>" <% } %> ><% this.text %></h2>`;
    return this.compile(temp, this.props);
  }
}

describe('Block tests', () => {
  it('Block renders HTML component', () => {
    const block = new TestBlock();
    const HTMLElement = block.getContent();
    expect(HTMLElement.outerHTML).to.equal('<h2></h2>');
  });

  it('Block uses props', () => {
    const headerWithoutProps = new TestBlock();
    const content = headerWithoutProps.getContent();
    expect(content.className).not.equal('header');
    expect(content.textContent).not.equal('TEST');

    const header = new TestBlock({ class: 'header', text: 'TEST' });
    const blockWithPropsContent = header.getContent();
    expect(blockWithPropsContent.className).to.equal('header');
    expect(blockWithPropsContent.textContent).to.equal('TEST');
  });

  it('Block renders props children', () => {
    const blockWithChildrenProps = new TestBlock({
      children: { input: new TestBlock() },
    });
    const children = blockWithChildrenProps.getContent().children;
    expect(!!children).to.be.true;
  });
});
