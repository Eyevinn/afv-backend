import { CloseEvent, MessageEvent, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Static, Type } from '@sinclair/typebox';
import MessageTranslator from './MessageTranslator';
import Logger from '../utils/Logger';

export const SerializedAgent = Type.Object({
  name: Type.String(),
  id: Type.String(),
  url: Type.String(),
  status: Type.String()
});

class Agent {
  _id: string;
  _url: string;
  _name: string;
  _websocket: WebSocket | null;
  _messageTranslator: MessageTranslator;
  _reconnectionAttempts: number;
  _hasSuccesfullyConnected: boolean;
  _isDeleting: boolean;

  constructor(url: string, name: string) {
    this._url = url;
    this._name = name;
    this._reconnectionAttempts = 0;
    this._hasSuccesfullyConnected = false;
    this._isDeleting = false;
    this._websocket = null;
    this._id = '';
    this._messageTranslator = new MessageTranslator();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this._websocket = new WebSocket(this._url, [], {
        handshakeTimeout: 5000
      });
      this._websocket.onopen = () => {
        if (this._reconnectionAttempts > 0) {
          this.refetchState();
        }
        if (!this._id) {
          this._id = uuidv4();
        }
        this._hasSuccesfullyConnected = true;
        this._reconnectionAttempts = 0;
        Logger.green(`Websocket successfully connected to: ${this._url}.`);
        this._websocket?.send(
          '{"resource":"/video/nodes/","type":"subscribe"}'
        );
        resolve('Success');
      };

      this._websocket.onmessage = (event: MessageEvent) => {
        const receivedMessage = event.data.toString();
        const outgoingMessage = this._messageTranslator.translate(
          event.data.toString()
        );

        Logger.yellow(`Receiving message: ${receivedMessage}`);

        if (!outgoingMessage.length) {
          Logger.black('No message sent because of no state change.');
        }

        outgoingMessage.forEach((msg: string) => {
          Logger.black(`Reply message: ${msg}`);
          this._websocket?.send(msg);
        });
      };

      this._websocket.onclose = (event: CloseEvent) => {
        Logger.yellow('Closing connection.');
        this._websocket = null;
        if (event.code > 1005 && this._hasSuccesfullyConnected) {
          this.reconnect();
        }
      };

      this._websocket.onerror = () => {
        const error = new Error(`Failed to connect to WebSocket: ${this._url}`);
        reject(error);
      };
    });
  }

  private reconnect() {
    if (this._reconnectionAttempts === 0) Logger.blue('Starting refetching...');
    this._reconnectionAttempts += 1;
    if (this._reconnectionAttempts < 6) {
      setTimeout(() => {
        if (this._isDeleting) {
          Logger.magenta('Agent has been deleted. Canceling reconnection.');
        } else {
          Logger.magenta(`Reconnect attempt ${this._reconnectionAttempts}...`);
          this.connect()?.catch((e: Error) => {
            Logger.red('WebSocket Reconnect Error: ' + e.message);
          });
        }
      }, 6000);
    } else {
      Logger.magenta('Stopping refetching.');
    }
  }

  private refetchState() {
    Logger.yellow('Refetching state');
    this._websocket?.send(
      JSON.stringify({ type: 'get', resource: '/video/nodes' })
    );
  }

  delete() {
    this._isDeleting = true;
    this._websocket?.close();
  }

  get status() {
    return this._websocket
      ? 'Connected'
      : this._reconnectionAttempts < 6
      ? 'Reconnecting'
      : 'Disconnected';
  }

  serialize(): Static<typeof SerializedAgent> {
    return {
      name: this._name,
      id: this._id,
      url: this._url,
      status: this.status
    };
  }
}

export default Agent;
