import { WebSocketServer } from 'ws';
import ReadLine from 'readline';
import { messages } from './messages';
import Logger from '../api/classes/Logger';

const PORT = 8080;
// Create websocket server using PORT
const wss = new WebSocketServer({ port: PORT });
Logger.yellow(`Waiting for WebSocket connection at: ws://localhost:${PORT}...`);
// Once the server connects to a WebSocketClient
wss.on('connection', (ws) => {
  // A function to handle keypress
  // Depending on the key it send a message from the messages file
  const listener = (str: string, key: any) => {
    if (key.ctrl && key.name === 'c') {
      Logger.red('ENDING...');
      process.exit();
    }

    const strAsNumber: keyof typeof messages = parseInt(
      str,
      10
    ) as keyof typeof messages;
    if (strAsNumber && 0 < strAsNumber && 10 > strAsNumber) {
      Logger.cyan(`You pressed: ${str}`);
      Logger.yellow(`Sending message: ${messages[strAsNumber]}`);
      ws.send(messages[strAsNumber] || 'No message found');
    }
  };

  Logger.green(
    `Websocket successfully connected - ${wss.clients.size} client${
      wss.clients.size > 1 ? 's' : ''
    } connected.`
  );
  Logger.magenta('Press any number to send a message...');
  ws.on('error', console.error);

  // Remove listener
  ws.on('close', () => {
    process.stdin.off('keypress', listener);
    Logger.red('Connection was closed.');
    if (wss.clients.size > 0) {
      Logger.yellow(
        `There ${wss.clients.size > 1 ? 'are' : 'is'} still ${
          wss.clients.size
        } client${wss.clients.size > 1 ? 's' : ''} connected.`
      );
      Logger.magenta('Press any number to send a message...');
    } else {
      Logger.yellow(
        `Waiting for WebSocket connection at: ws://localhost:${PORT}...`
      );
    }
  });

  // When receiving a message - log it
  ws.on('message', function message(data) {
    Logger.black(`Received message: ${data.toString()}`);
  });

  // When pressing a number call listener
  ReadLine.emitKeypressEvents(process.stdin);
  if (process.stdin.setRawMode != null) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on('keypress', listener);
});

wss.on('error', (error) => {
  Logger.red('WebSocket Server Error: ' + error.message);
});

wss.on('close', () => {
  Logger.red('WebSocket Server Close');
});
