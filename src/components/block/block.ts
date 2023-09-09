import { v4 as uuid } from 'uuid';
import EventBus from './eventBus';
import Templator from './templator';
import { cloneDeep, merge } from 'lodash';
import { Chat } from '../../store/store';

export type someObj = {
  [x: string]: unknown;
  children?: { [x: string]: Block };
  errors?: { [x: string]: boolean };
  events?: { eventName: string; callback: (e: Event) => void }[];
  modal?: { type?: string; inputValue?: string };
  chatList?: Chat[];
};

class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  protected _element!: HTMLElement;

  public id = uuid();

  public children: { [id: string]: Block } = {};
  public events: { eventName: string; callback: (e: Event) => void }[] = [];
  protected eventBus: () => EventBus;

  public props: someObj = {};

  constructor(propsAndChildren: someObj = {}) {
    const { children, props } = this._getChildren(propsAndChildren);
    this.children = children;
    const eventBus = new EventBus();

    this.props = this._makePropsProxy(props);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildren(propsAndChildren: someObj) {
    const children: { [id: string]: Block } = {};
    const props: someObj = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    this._element = this._createDocumentElement('div');
  }

  private _addCustomEvents() {
    if (undefined !== this.events && (this.events as []).length > 0) {
      (
        this.events as {
          eventName: string;
          callback: (e: Event) => void;
        }[]
      ).forEach(({ eventName, callback }) =>
        this._element.addEventListener(eventName, callback)
      );
    }
  }

  private _addEvents() {
    if (
      undefined !== this.props.events &&
      (this.props.events as []).length > 0
    ) {
      (
        this.props.events as {
          eventName: string;
          callback: (e: Event) => void;
        }[]
      ).forEach(({ eventName, callback }) =>
        this._element.addEventListener(eventName, callback)
      );
    }
  }

  private _removeCustomEvents() {
    if (undefined !== this.events && (this.events as []).length > 0) {
      (
        this.events as {
          eventName: string;
          callback: (e: Event) => void;
        }[]
      ).forEach(({ eventName, callback }) =>
        this._element.removeEventListener(eventName, callback)
      );
    }
  }

  private _removeEvents() {
    if (
      undefined !== this.props.events &&
      (this.props.events as []).length > 0
    ) {
      (
        this.props.events as {
          eventName: string;
          callback: (e: Event) => void;
        }[]
      ).forEach(({ eventName, callback }) =>
        this._element.removeEventListener(eventName, callback)
      );
    }
  }

  protected init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidMount() {
    this.componentDidMount();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected componentDidMount() {}

  protected dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate() {
    const response = this.componentDidUpdate();
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate() {
    return true;
  }

  public setProps = (nextProps: someObj) => {
    if (!nextProps) {
      return;
    }
    const merged = merge(cloneDeep(this.props), nextProps);
    Object.assign(this.props, merged);
  };

  protected compile(template: string, props: someObj) {
    const propsAndStubs = { ...props };

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
    });

    const fragment = this._createDocumentElement(
      'template'
    ) as HTMLTemplateElement;

    fragment.innerHTML = new Templator(template).compile(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });
    return fragment.content;
  }

  get element(): HTMLElement {
    return this._element;
  }

  private _render(): void {
    this._removeEvents();
    this._removeCustomEvents();

    const block = this.render();

    const newElement = block.firstElementChild as HTMLTemplateElement;

    if (this._element) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement;
    this._addEvents();
    this._addCustomEvents();
  }

  protected render(): HTMLElement | DocumentFragment {
    return document.createElement('div');
  }

  getContent(): HTMLElement {
    return this.element;
  }

  private _makePropsProxy(props: someObj) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return new Proxy(props, {
      get(target, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        // eslint-disable-next-line no-param-reassign
        target[prop] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  private _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);

    return element;
  }

  public show(force = false) {
    if (force) {
      this.getContent().classList.add('route-active');
    } else {
      if (this.getContent()) {
        this.getContent().classList.add('route-hidden');

        setTimeout(() => {
          this.getContent().classList.remove('route-hidden');
          this.getContent().classList.add('route-active');
        }, 200);
      }
    }
  }

  public hide() {
    this.getContent().classList.remove('route-active');
    this.getContent().classList.add('route-hidden');
  }

  public destroy() {
    if (this._element) {
      this._element.remove();
      this.onDestroy();
    }
  }

  public onDestroy(): void {
    return;
  }
}

export default Block;
