import { CloseEvent, WebSocket } from 'ws';
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
      this._websocket = new WebSocket(this._url);
      this._websocket.onopen = () => {
        this._id = uuidv4();
        resolve('Success');
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
