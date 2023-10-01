import Block, { someObj } from '../components/block/block';

function isEqual(lhs: string, rhs: string) {
  return lhs === rhs;
}

function render(query: unknown, block: Block) {
  const root = document.getElementById(query as string);
  if (root) {
    root.append(block.getContent());
    return root;
  }
  return false;
}

class Route {
  public pathname: string;

  private _blockClass: typeof Block;

  private _block: Block | null;

  private _props: someObj;

  constructor(pathname: string, view: typeof Block, props: someObj) {
    this.pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.destroy();
    }
  }

  match(pathname: string) {
    return isEqual(pathname, this.pathname);
  }

  render() {
    this._block = new this._blockClass();
    if (this._props.rootQuery) render(this._props.rootQuery, this._block);
    this._block.show();
  }

  getPathname() {
    return this.pathname;
  }
}

export default Route;
