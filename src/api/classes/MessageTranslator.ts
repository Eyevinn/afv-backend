import Logger from '../utils/Logger';
import DeepDiff from 'deep-diff';

enum MessageTypes {
  EVENT = 'event',
  SUBSCRIBE_RESPONSE = 'subscribe-response',
  STATE_CHANGE = 'state-change',
  GET_RESPONSE = 'get-response'
}

enum VideoNodes {
  AUX_1_SELECT = 'aux1_select',
  AUX_2_SELECT = 'aux2_select',
  ISO_1_SELECT = 'iso1_select',
  ISO_2_SELECT = 'iso2_select',
  TRANSITION = 'transition'
}

enum VideoNodeTypes {
  OUTPUT = 'output',
  SELECT = 'select',
  ALPHA_OVER = 'alpha_over',
  TRANSFORM = 'transform',
  FADE_TO_BLACK = 'fade_to_black',
  TRANSITION = 'transition'
}

interface OutputVideoNode {
  type: VideoNodeTypes.OUTPUT;
}

interface SelectVideoNode {
  type: VideoNodeTypes.SELECT;
  input: number;
}

interface AlphaOverVideoNode {
  type: VideoNodeTypes.ALPHA_OVER;
  factor: number;
}

interface TransformVideoNode {
  type: VideoNodeTypes.TRANSFORM;
  scale: number;
  x: number;
  y: number;
}

interface FadeToBlackVideoNode {
  type: VideoNodeTypes.FADE_TO_BLACK;
  factor: number;
}

interface TransitionVideoNode {
  type: VideoNodeTypes.TRANSITION;
  factor?: number;
  mode?: string;
  preview?: number;
  program: number;
}

type VideoNode =
  | OutputVideoNode
  | SelectVideoNode
  | AlphaOverVideoNode
  | TransformVideoNode
  | FadeToBlackVideoNode
  | TransitionVideoNode;

interface TranslatorState {
  [key: string]: VideoNode;
}

interface BasicMesage {
  resource: string;
  type: MessageTypes;
  timestamp?: number;
}

export interface IncomingMessage extends BasicMesage {
  body?: TranslatorState | Outputs;
  address?: string;
  connected_node?: string;
  event?: string;
  actor?: string;
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

enum OutputNames {
  AUX_1 = 'aux1',
  AUX_2 = 'aux2',
  ISO_1 = 'iso1',
  ISO_2 = 'iso2',
  PROGRAM = 'program'
}

interface OutputInput {
  index: number;
  origin: string;
  source: string;
  subMixes?: number[];
}

interface Output {
  input: OutputInput;
}

interface Outputs {
  [key: string]: Output;
}

class MessageTranslator {
  _state: TranslatorState | null;
  _outputs: Outputs | null;

  constructor() {
    this._state = null;
    this._outputs = null;
  }

  mappedOutput(output: string) {
    let outputName = '';
    switch (output) {
      case VideoNodes.TRANSITION:
        outputName = OutputNames.PROGRAM;
        break;
      case VideoNodes.AUX_1_SELECT:
        outputName = OutputNames.AUX_1;
        break;
      case VideoNodes.AUX_2_SELECT:
        outputName = OutputNames.AUX_2;
        break;
      case VideoNodes.ISO_1_SELECT:
        outputName = OutputNames.ISO_1;
        break;
      case VideoNodes.ISO_2_SELECT:
        outputName = OutputNames.ISO_2;
        break;
    }
    if (!outputName) return;
    return this._outputs?.[outputName];
  }

  translate(msg: string): string[] {
    const parsedMsg: IncomingMessage = JSON.parse(msg);
    const returnMessages: Array<string | string[]> = [];
    switch (parsedMsg.type) {
      case MessageTypes.GET_RESPONSE:
        this.handleGetResponse(parsedMsg);
        break;
      case MessageTypes.SUBSCRIBE_RESPONSE:
        if (!parsedMsg.body) break;
        if (!this._state) this._state = parsedMsg.body as TranslatorState;
        else {
          returnMessages.push(
            this.updateState(parsedMsg.body as TranslatorState)
          );
        }
        break;
      case MessageTypes.STATE_CHANGE:
        if (!parsedMsg.body) break;
        Logger.black(JSON.stringify(parsedMsg));
        returnMessages.push(
          this.handleStateChange(parsedMsg.body as TranslatorState)
        );
        break;
      default:
      case MessageTypes.EVENT:
        break;
    }
    return returnMessages.flat();
  }

  private handleGetResponse(parsedMsg: IncomingMessage) {
    if (!parsedMsg.body) return;
    if (parsedMsg.resource === '/audio/outputs') {
      this._outputs = parsedMsg.body as Outputs;
    }
  }

  handleStateChange(state: TranslatorState): string[] {
    if (!this._state) return [];
    const copiedState: TranslatorState = JSON.parse(
      JSON.stringify(this._state)
    );
    for (const property in state) {
      copiedState[property] = { ...copiedState[property], ...state[property] };
    }
    return this.updateState(copiedState);
  }

  updateState(state: TranslatorState): string[] {
    if (this._state && state) {
      const diffs: DeepDiff.Diff<TranslatorState>[] | undefined = DeepDiff(
        this._state,
        state
      );
      if (!diffs) return [];
      this._state = state;
      return this.generateResponse(diffs);
    }
    return [];
  }

  generateResponse(diffs: DeepDiff.Diff<TranslatorState>[]): string[] {
    const returnMessages: string[] = [];
    Logger.magenta(JSON.stringify(diffs));
    diffs.forEach((diff: DeepDiff.Diff<TranslatorState>) => {
      if (
        diff.kind !== 'E' ||
        !diff.path ||
        !['program', 'input'].includes(diff.path[1])
      )
        return;

      const output = this.mappedOutput(diff.path[0]);
      const outputMixIndex = output?.input.index;
      if (outputMixIndex || outputMixIndex === 0) {
        returnMessages.push(
          this.generateMessage(
            outputMixIndex,
            diff.lhs as unknown as number,
            true
          )
        );
        returnMessages.push(
          this.generateMessage(outputMixIndex, diff.rhs as unknown as number)
        );
      }
    });
    return returnMessages;
  }

  generateMessage(output: number, mix: number, fadeOut = false) {
    return `{"resource":"/audio/mixes/${output}/inputs/mixes/${mix}","type":"command","body":{"command":"fade","parameters":${
      fadeOut
        ? '{"volume":0.0,"duration_ms":200}'
        : '{"volume":1.0,"duration_ms":500}'
    }}}`;
  }
}

export default MessageTranslator;
