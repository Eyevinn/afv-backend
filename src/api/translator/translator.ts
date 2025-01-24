import MessageMapping, { Messages } from './message-mapping';

const translator = (message: string): string[] => {
  const foundMessage = MessageMapping.find((msg: Messages) => {
    return JSON.stringify(msg.incoming) === message;
  });
  if (foundMessage)
    return foundMessage.outgoing.map((msg) => JSON.stringify(msg));
  return [];
};

export default translator;
