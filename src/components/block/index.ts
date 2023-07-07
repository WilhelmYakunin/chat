import { v4 as uuid } from 'uuid';
import EventBus from './eventBus';
import { compile } from 'handlebars';
export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  protected _element: HTMLElement | HTMLFormElement =
    document.createElement('div');
  protected _meta: {
    tagName: string;
    props: {
      [x: string]: unknown;
      template?: string;
      data?: unknown;
      children?: Block[];
      events?: {
        eventName: keyof HTMLElementEventMap;
        callback: EventListener;
      }[];
    };
  } = {
    tagName: '',
    props: {},
  };
  public id = uuid();
  private eventBus: EventBus;
  public props: { [x: string]: unknown } = {};

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
  constructor(tagName = 'div', props = {}) {
    this._meta = {
      tagName,
      props,
    };
    const eventBus = new EventBus();
    this.eventBus = eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);

    this.props = this._makePropsProxy(props);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    this._element = this._createDocumentElement();
  }

  protected init() {
    this._createResources();

    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();
  }

  protected componentDidMount(): void {
    return;
  }

  protected dispatchComponentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
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

  public setProps = (nextProps: unknown) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    this._registerEvents;
    this._removeEvents();

    const { children } = this._meta.props;
    if (children && children.length !== 0)
      children.forEach((child) => {
        this._element?.appendChild(child.getContent());
      });
    this._addEvents();
  }

  render(): string {
    return '';
  }

  public getContent() {
    return this.element;
  }

  private _makePropsProxy(props: { [x: string]: unknown }) {
    const ctxEventBus = this.eventBus;

    return new Proxy(props, {
      get(target, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        target[prop as string] = value;

        ctxEventBus.emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _createDocumentElement() {
    const { template, data } = this._meta.props;
    const parser = new DOMParser();
    if (template) {
      const html = parser.parseFromString(compile(template)(data), 'text/html');

      return html.body.firstChild as HTMLElement;
    }
    return document.createElement(this._meta.tagName);
  }

  private _addEvents() {
    const { events } = this._meta.props;

    if (events) {
      events.forEach(({ eventName, callback }) => {
        if (this._element)
          this._element.addEventListener(String(eventName), callback);
      });
    }
  }

  private _removeEvents() {
    const { events } = this._meta.props;

    if (events) {
      events.forEach(({ eventName, callback }) => {
        if (this._element)
          this._element.removeEventListener(eventName, callback);
      });
    }
  }

  show() {
    if (this._element) (this._element as HTMLElement).style.display = 'block';
  }

  hide() {
    if (this._element) (this._element as HTMLElement).style.display = 'none';
  }
}
