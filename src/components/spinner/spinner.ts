import Block from '../block/block';
import './default.css';

export default class Loader extends Block {
  render() {
    const temp = `<div class="spinner" role="status">
                        <span>Loading...</span>
                  </div>`;

    return this.compile(temp, this.props);
  }
}
