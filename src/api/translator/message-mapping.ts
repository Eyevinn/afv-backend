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

export interface Messages {
  incoming: IncomingMessage;
  outgoing: OutgoingMessage[];
}

const MessageMapping: Messages[] = [
  {
    incoming: {
      resource: '/video/nodes/transition',
      type: 'state-change',
      body: { program: 3 },
      actor: 'other'
    },
    outgoing: [
      {
        resource: '/audio/outputs/0/strip_faders/1',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 0, duration_ms: 200 } }
      },
      {
        resource: '/audio/outputs/0/strip_faders/3',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 1, duration_ms: 500 } }
      }
    ]
  },
  {
    incoming: {
      resource: '/video/nodes/aux1_select',
      type: 'state-change',
      body: { input: 3 },
      actor: 'other'
    },
    outgoing: [
      {
        resource: '/audio/outputs/1/strip_faders/1',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 0, duration_ms: 200 } }
      },
      {
        resource: '/audio/outputs/1/strip_faders/3',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 1, duration_ms: 500 } }
      }
    ]
  },
  {
    incoming: {
      resource: '/video/nodes/aux2_select',
      type: 'state-change',
      body: { input: 3 },
      actor: 'other'
    },
    outgoing: [
      {
        resource: '/audio/outputs/1/strip_faders/1',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 0, duration_ms: 200 } }
      },
      {
        resource: '/audio/outputs/1/strip_faders/3',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 1, duration_ms: 500 } }
      }
    ]
  },
  {
    incoming: {
      resource: '/video/nodes/iso1_select',
      type: 'state-change',
      body: { input: 3 },
      actor: 'other'
    },
    outgoing: [
      {
        resource: '/audio/outputs/1/strip_faders/1',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 0, duration_ms: 200 } }
      },
      {
        resource: '/audio/outputs/1/strip_faders/3',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 1, duration_ms: 500 } }
      }
    ]
  },
  {
    incoming: {
      resource: '/video/nodes/iso2_select',
      type: 'state-change',
      body: { input: 3 },
      actor: 'other'
    },
    outgoing: [
      {
        resource: '/audio/outputs/1/strip_faders/1',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 0, duration_ms: 200 } }
      },
      {
        resource: '/audio/outputs/1/strip_faders/3',
        type: 'command',
        body: { command: 'fade', parameters: { volume: 1, duration_ms: 500 } }
      }
    ]
  }
];

export default MessageMapping;
