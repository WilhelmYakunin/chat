import Block from '../components/block';

type TProps = {
  [x: string]: unknown;
  rootQuery: string;
};

const render = (query: string, block: Block) => {
  const root = document.getElementById(query);
  if (root) {
    root.append(block.getContent());
    return root;
  }
  return false;
};

export default class Route {
  private _pathname: string;
  private _block: Block | null;
  private _blockClass: Block;
  private _props: TProps;

  constructor(pathname: string, view: Block, props: TProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  render() {
    if (!this._block) {
      this._block = this._blockClass;
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
