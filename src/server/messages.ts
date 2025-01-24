import MessageMapping, {
  IncomingMessage
} from '../api/translator/message-mapping';

export const messages: { [key: number]: string } = {
  1: JSON.stringify(MessageMapping[0].incoming),
  2: JSON.stringify(MessageMapping[1].incoming),
  3: JSON.stringify(MessageMapping[2].incoming),
  4: JSON.stringify(MessageMapping[3].incoming),
  5: JSON.stringify(MessageMapping[4].incoming),
  6: JSON.stringify(MessageMapping[0].incoming),
  7: JSON.stringify(MessageMapping[1].incoming),
  8: JSON.stringify(MessageMapping[2].incoming),
  9: JSON.stringify(MessageMapping[3].incoming),
  0: JSON.stringify(MessageMapping[4].incoming)
};
