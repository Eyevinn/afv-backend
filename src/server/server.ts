import { WebSocketServer } from 'ws';
import ReadLine from 'readline';
import { messages } from './messages';

const PORT = 8080;
// Create websocket server using PORT
const wss = new WebSocketServer({ port: PORT });
console.log(
  `\x1b[33mWaiting for WebSocket connection at: ws://localhost:${PORT}...\x1b[0m`
);
// Once the server connects to a WebSocketClient
wss.on('connection', (ws) => {
  // A function to handle keypress
  // Depending on the key it send a message from the messages file
  const listener = (str: string, key: any) => {
    if (key.ctrl && key.name === 'c') {
      console.log('\x1b[31mENDING...\x1b[0m');
      process.exit();
    }

    const strAsNumber: keyof typeof messages = parseInt(
      str,
      10
    ) as keyof typeof messages;
    if (strAsNumber && 0 < strAsNumber && 10 > strAsNumber) {
      console.log('\x1b[36mYou pressed: ' + str + '\x1b[0m');
      console.log(
        '\x1b[33mSending message: ' + messages[strAsNumber] + '\x1b[0m'
      );
      ws.send(messages[strAsNumber] || 'No message found');
    }
  };

  console.log(
    `\x1b[32mWebsocket successfully connected - ${wss.clients.size} client${
      wss.clients.size > 1 ? 's' : ''
    } connected.\x1b[0m`
  );
  console.log('\x1b[35mPress any number to send a message...\x1b[0m');
  ws.on('error', console.error);

  // Remove listener
  ws.on('close', () => {
    process.stdin.off('keypress', listener);
    console.log('\x1b[31mConnection was closed.\x1b[0m');
    if (wss.clients.size > 0) {
      console.log(
        `\x1b[33mThere ${wss.clients.size > 1 ? 'are' : 'is'} still ${
          wss.clients.size
        } client${wss.clients.size > 1 ? 's' : ''} connected.\x1b[0m`
      );
      console.log('\x1b[35mPress any number to send a message...\x1b[0m');
    } else {
      console.log(
        `\x1b[33mWaiting for WebSocket connection at: ws://localhost:${PORT}...\x1b[0m`
      );
    }
  });

  // When receiving a message - log it
  ws.on('message', function message(data) {
    console.log(`\x1b[30mReceived message: ${data.toString()}\x1b[0m`);
  });

  // When pressing a number call listener
  ReadLine.emitKeypressEvents(process.stdin);
  if (process.stdin.setRawMode != null) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on('keypress', listener);
});
