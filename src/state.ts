import EventBus from './components/block/eventBus';
import { isEqual, merge, cloneDeep } from 'lodash';

export type Message = {
  user: {
    first_name: string;
    second_name: string;
    avatar: null | string;
    email: string;
    login: string;
    phone: string;
  };
  time: Date;
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  avatar: null | string;
  unread_count: number;
  created_by: string;
  last_message: null | Message;
};

class Store {
  private _state: IState;

  private _oldState: IState;

  public _subscribers: {
    [x: string]: (arg: IState) => unknown;
  };

  private eventBus: () => EventBus;

  static EVENTS = {
    INIT: '@@init',
    STORE_DM: '@@store-did-mount',
    STORE_DU: '@@store-did-update',
    USE: '@@use',
  };

  public isLoad: boolean;

  constructor(initialState: IState) {
    const eventBus = new EventBus();
    this._state = this._makeStateProxy(initialState);
    this._oldState = { ...this._state };
    this._subscribers = {};
    this.eventBus = () => eventBus;
    this.isLoad = false;

    // Регистрируем события жизненного цикла
    eventBus.on(Store.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Store.EVENTS.STORE_DM, this._storeDidMount.bind(this));
    eventBus.on(
      Store.EVENTS.STORE_DU,
      this._storeDidUpdate.bind(this, this._oldState)
    );
    eventBus.on(Store.EVENTS.USE, this._use.bind(this));

    eventBus.emit(Store.EVENTS.INIT);
  }

  private _init() {
    this.eventBus().emit(Store.EVENTS.STORE_DM);
  }

  private _storeDidMount() {
    this.storeDidMount();
  }

  public storeDidMount() {
    this.isLoad = true;
  }

  private _storeDidUpdate(oldState: unknown, newState: unknown) {
    const response = this.storeDidUpdate(oldState, newState);
    if (response) {
      this.eventBus().emit(Store.EVENTS.USE);
    }
  }

  public storeDidUpdate(oldState: unknown = {}, newState: unknown = {}) {
    return !isEqual(oldState, newState);
  }

  private _use() {
    for (const id in this._subscribers) {
      if (this._subscribers[id]) {
        this._subscribers[id](this._state);
      }
    }
  }

  public subscribe(subscriber: (state: IState) => void, id = '') {
    if (id) {
      this._subscribers[id] = subscriber;
      subscriber(this._state);
    }
  }

  public setState(newState: { [x: string]: unknown }) {
    if (!newState) {
      return;
    }
    const merged = merge(cloneDeep(this._state), newState);
    this._state = merged;
    for (const listener of Object.values(this._subscribers)) {
      listener(this._state);
    }
  }

  public getState() {
    return this._state;
  }

  private _makeStateProxy(state: IState) {
    return new Proxy(state, {
      set: (target: IState) => {
        const t = target;
        this.eventBus().emit(Store.EVENTS.STORE_DU, this._oldState, t);
        this._oldState = { ...t };
        return true;
      },
      deleteProperty: () => {
        throw new Error('Нет доступа');
      },
    });
  }
}

interface IState {
  signin: { isLogging: boolean; login: string; password: string };
  signup: { isSignup: boolean; login: string; password: string };
  settings: {
    isLoading: boolean;
    id: string;
    avatar: string;
    first_name: string;
    last_name: string;
    display_name: string;
    login: string;
    old_password: string;
    email: string;
    phone: string;
    errors: {
      first_name: boolean;
      second_name: boolean;
      display_name: boolean;
      login: boolean;
      email: boolean;
      old_password: boolean;
      new_password: boolean;
      phone: boolean;
    };
  };
  modal: {
    type: string;
    inputValue: string;
  };
  chats: chat[];
}

const defaultState = {
  signin: { isLogging: false, login: '', password: '' },
  signup: { isSignup: false, login: '', password: '' },
  settings: {
    isLoading: false,
    id: '',
    avatar: '',
    first_name: '',
    last_name: '',
    display_name: '',
    login: '',
    old_password: '',
    email: '',
    phone: '',
    errors: {
      first_name: false,
      second_name: false,
      display_name: false,
      login: false,
      email: false,
      old_password: false,
      new_password: false,
      phone: false,
    },
  },
  modal: {
    type: 'none',
    inputValue: '',
  },
  chats: [],
};

export default new Store(defaultState);
