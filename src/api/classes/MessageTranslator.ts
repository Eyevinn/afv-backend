interface BasicMesage {
  resource: string;
  type: string;
}

export interface IncomingMessage extends BasicMesage {
  body: {
    input?: number;
    program?: number;
  };
  actor: string;
}

export interface OutgoingMessage extends BasicMesage {
  body: {
    command: string;
    parameters: {
      volume: number;
      duration_ms: number;
    };
  };
}

interface TranslatorState {
  [key: number]: number;
}

class MessageTranslator {
  _state: TranslatorState;

  constructor() {
    this._state = {};
  }

  mappedOutput(output: string): number {
    switch (output) {
      default:
      case 'transition':
        return 0;
      case 'aux1_select':
        return 1;
      case 'aux2_select':
        return 2;
      case 'iso1_select':
        return 3;
      case 'iso2_select':
        return 4;
    }
  }

  generateResponse(output: number, strip: number, fadeOut = false) {
    return `{"resource":"/audio/outputs/${output}/strip_faders/${strip}","type":"command","body":{"command":"fade","parameters":${
      fadeOut
        ? '{"volume":0,"duration_ms":200}'
        : '{"volume":1,"duration_ms":500}'
    }}}`;
  }

  translate(msg: string): string[] {
    const parsedMsg: IncomingMessage = JSON.parse(msg);
    const output = this.mappedOutput(parsedMsg.resource.split('/nodes/')[1]);
    const strip = parsedMsg.body.input || parsedMsg.body.program || 0;
    const outputMsgs = [];
    if (this._state[output]) {
      // if output is already on that strip don't send any message
      if (this._state[output] === strip) return [];
      outputMsgs.push(this.generateResponse(output, this._state[output], true));
    }
    outputMsgs.push(this.generateResponse(output, strip));
    this._state[output] = strip;
    return outputMsgs;
  }
}

export default MessageTranslator;
