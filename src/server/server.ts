import { WebSocketServer } from 'ws';
import ReadLine from 'readline';
import { messages } from './messages';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
console.log(
  `\x1b[33mWaiting for WebSocket connection at: ws://localhost:${PORT}...\x1b[0m`
);
wss.on('connection', function connection(ws) {
  console.log('\x1b[32mWebsocket successfully connected.\x1b[0m');
  console.log('\x1b[35mPress any number to send a message...\x1b[0m');
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log(`\x1b[30mReceived message: ${data.toString()}\x1b[0m`);
  });

  ReadLine.emitKeypressEvents(process.stdin);
  if (process.stdin.setRawMode != null) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on('keypress', (str: string, key) => {
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
  });
});
