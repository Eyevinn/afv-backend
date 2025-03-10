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
  _healthCheckInterval: ReturnType<typeof setInterval> | undefined;
  _reconnectionTimeout: ReturnType<typeof setTimeout> | undefined;

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
        if (!this._id) {
          this._id = uuidv4();
        }
        this._hasSuccesfullyConnected = true;
        this._reconnectionAttempts = 0;
        Logger.green(`Websocket successfully connected to: ${this._url}.`);
        this.activateHealthCheck();
        this.subscribeToVideoNodes();
        this.subscribeToAudioOutputs();
        resolve('Success');
      };

      this._websocket.onmessage = (event: MessageEvent) => {
        this.handleMessage(event.data.toString());
      };

      this._websocket.onclose = (event: CloseEvent) => {
        Logger.yellow('Closing connection.');
        clearInterval(this._healthCheckInterval);
        clearTimeout(this._reconnectionTimeout);
        this._websocket = null;
        if (event.code > 1005 && this._hasSuccesfullyConnected) {
          this.reconnect();
        }
      };

      this._websocket.onerror = () => {
        clearInterval(this._healthCheckInterval);
        clearTimeout(this._reconnectionTimeout);
        const error = new Error(`Failed to connect to WebSocket: ${this._url}`);
        reject(error);
      };
    });
  }

  private activateHealthCheck() {
    if (!this._websocket) return;
    Logger.cyan('Starting ping');
    this._healthCheckInterval = setInterval(() => {
      this._websocket?.ping('ping');
    }, 30000);
  }

  private reconnect() {
    if (this._reconnectionAttempts === 0)
      Logger.blue('Starting reconnection...');
    this._reconnectionAttempts += 1;

    this._reconnectionTimeout = setTimeout(
      () => {
        if (this._isDeleting) {
          Logger.magenta('Agent has been deleted. Canceling reconnection.');
        } else {
          Logger.magenta(`Reconnect attempt ${this._reconnectionAttempts}...`);
          this.connect()?.catch((e: Error) => {
            Logger.red('WebSocket Reconnect Error: ' + e.message);
          });
        }
      },
      this._reconnectionAttempts < 6 ? 6000 : 30000
    );
  }

  private subscribeToVideoNodes() {
    if (!this._websocket) return;
    Logger.yellow('Subscribing to video nodes');
    this._websocket.send('{"resource":"/video/nodes","type":"subscribe"}');
  }

  private subscribeToAudioOutputs() {
    if (!this._websocket) return;
    Logger.yellow('Subscribing to audio output nodes');
    this._websocket.send('{"resource":"/audio/outputs","type":"subscribe"}');
  }

  private handleMessage(msg: string) {
    if (!this._websocket) return;
    const outgoingMessages = this._messageTranslator.translate(msg);
    if (!outgoingMessages.length) return;

    outgoingMessages.forEach((msg: string) => {
      Logger.green(`Reply: ${msg}`);
      this._websocket?.send(msg);
    });
  }

  delete() {
    Logger.red('Deleting agent: ' + this._id);
    this._isDeleting = true;
    this._websocket?.close();
    clearInterval(this._healthCheckInterval);
    clearTimeout(this._reconnectionTimeout);
  }

  get status() {
    return this._websocket
      ? 'Connected'
      : this._reconnectionAttempts > 0
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
