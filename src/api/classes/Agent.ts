import { MessageEvent, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Static, Type } from '@sinclair/typebox';
import MessageTranslator from './MessageTranslator';

export const SerializedAgent = Type.Object({
  name: Type.String(),
  id: Type.String(),
  url: Type.String()
});

class Agent {
  _url: string;
  _name: string;
  _websocket: WebSocket | null;
  _id: string;
  _messageTranslator: MessageTranslator;

  constructor(url: string, name: string) {
    this._url = url;
    this._name = name;
    this._websocket = null;
    this._id = '';
    this._messageTranslator = new MessageTranslator();
  }

  init() {
    return new Promise((resolve, reject) => {
      this._websocket = new WebSocket(this._url, [], {
        handshakeTimeout: 5000
      });
      this._websocket.onopen = () => {
        this._id = uuidv4();
        console.log(
          `\x1b[32mWebsocket successfully connected to: ${this._url}.\x1b[0m`
        );
        resolve('Success');
      };

      this._websocket.onmessage = (event: MessageEvent) => {
        const receivedMessage = event.data.toString();
        const outgoingMessage = this._messageTranslator.translate(
          event.data.toString()
        );

        console.log(`\x1b[33mReceiving message: ${receivedMessage} \x1b[0m`);

        if (!outgoingMessage.length) {
          console.log(
            `\x1b[30mNo message sent because of no state change.\x1b[0m`
          );
        }

        outgoingMessage.forEach((msg: string) => {
          console.log(`\x1b[30mReply message: ${msg}\x1b[0m`);
          this._websocket?.send(msg);
        });
      };

      this._websocket.onclose = () => {
        // if (event) console.log(event);
        console.log('Closing connection');
        this._websocket = null;
      };

      this._websocket.onerror = (error) => {
        console.log(error.error);
        reject(error);
      };
    });
  }

  close() {
    this._websocket?.close();
  }

  serialize(): Static<typeof SerializedAgent> {
    return {
      name: this._name,
      id: this._id,
      url: this._url
    };
  }
}

export default Agent;
