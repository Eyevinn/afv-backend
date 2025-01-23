import { CloseEvent, MessageEvent, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Static, Type } from '@sinclair/typebox';

export const SerializedAgent = Type.Object({
  url: Type.String(),
  id: Type.String()
});

class Agent {
  _url: string;
  _websocket: WebSocket | null;
  _id: string;

  constructor(url: string) {
    this._url = url;
    this._websocket = null;
    this._id = '';
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
        console.log(
          `\x1b[33mReceiving message: ${event.data.toString()} \x1b[0m`
        );
        console.log(
          `\x1b[30mReply message: ${
            event.data.toString() === 'Hejsan' ? 'Hej då' : 'Hanson'
          }\x1b[0m`
        );
        this._websocket?.send(
          event.data.toString() === 'Hejsan' ? 'Hej då' : 'Hanson'
        );
      };

      this._websocket.onclose = (event: CloseEvent) => {
        this.close(event);
      };

      this._websocket.onerror = (error) => {
        console.log(error.error);
        reject(error);
      };
    });
  }

  close(closeEvent?: CloseEvent) {
    if (closeEvent) console.log(closeEvent);
    this._websocket?.close();
    this._websocket = null;
  }

  serialize(): Static<typeof SerializedAgent> {
    return {
      id: this._id,
      url: this._url
    };
  }
}

export default Agent;
