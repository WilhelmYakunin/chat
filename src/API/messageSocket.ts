import { wsURL } from './serverPaths';
import store from '../store/store';

declare interface IMessageData {
  message?: string;
}

declare interface IWSOptions {
  userId: number;
  chatId: number;
  token: string;
}

declare interface IGetMessagesOptions {
  offset: number;
}

class MessageSocket {
  private _ws!: WebSocket;

  private _chatId!: number;

  private _token!: string;

  private _ping!: number;

  _userId!: number;

  constructor() {
    this._onOpen = this._onOpen.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onError = this._onError.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  private _addEvents() {
    this._ws.addEventListener('open', this._onOpen);
    this._ws.addEventListener('message', this._onMessage);
    this._ws.addEventListener('error', this._onError);
    this._ws.addEventListener('close', this._onClose);
  }

  private _removeEvents() {
    this._ws.removeEventListener('open', this._onOpen);
    this._ws.removeEventListener('message', this._onMessage);
    this._ws.removeEventListener('error', this._onError);
    this._ws.removeEventListener('close', this._onClose);
  }

  private _onOpen() {
    this.getMessages({ offset: 0 });
    this._ping = setInterval(() => {
      this._ws.send('');
    }, 15000);
  }

  private _onMessage(response: MessageEvent) {
    const data = JSON.parse(response.data);
    if (Array.isArray(data)) {
      if (!data.length) {
        store.setState({ currentChat: { messages: [] } });
      } else {
        store.setState({
          currentChat: { messages: data.reverse() },
        });
      }
    } else if (typeof data === 'object' && data.type === 'message') {
      const newMessages = store.getState().currentChat.messages;
      newMessages.push(data);
      store.setState({ currentChat: { messages: newMessages } });
    }
  }

  private _onError(event: Event) {
    console.log('ERROR: ' + (event as ErrorEvent).message);
  }

  private _onClose(event: CloseEventInit) {
    this._removeEvents();
    if (event.wasClean) {
      console.log('Connection closed', 'error');
    } else {
      console.log('Network error', 'error');
    }

    if (event.code === 1006) {
      this._reconnect();
    }
  }

  private _reconnect() {
    this.connect({
      userId: this._userId,
      chatId: this._chatId,
      token: this._token,
    });
  }

  public connect(options: IWSOptions) {
    console.log('ПОДКЛЮЧАЕМ WS');
    this._userId = options.userId;
    this._chatId = options.chatId;
    this._token = options.token;
    this._ws = new WebSocket(
      `${wsURL}/chats/${options.userId}/${options.chatId}/${options.token}`
    );
    this._addEvents();
  }

  public getMessages(options: IGetMessagesOptions) {
    this._ws.send(
      JSON.stringify({
        content: options.offset.toString(),
        type: 'get old',
      })
    );
  }

  public closeConnection() {
    console.log('ЗАКРЫВАЕМ WS СОЕДИНЕНИЕ');
    clearInterval(this._ping);
    if (this._ws) {
      this._ws.close();
      this._removeEvents();
    }
  }

  public sendMessage(data: IMessageData) {
    if (data.message) {
      this._ws.send(
        JSON.stringify({
          content: data.message,
          type: 'message',
        })
      );
    }
  }
}

export default new MessageSocket();
