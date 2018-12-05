// @flow
import _ from 'struct-fu';

const HEADER_COMMUNICATION = _.struct('Header', [
  _.int32le('magicNumber'),
  _.uint32le('packageSize'),
  _.uint32le('id'),
]);

const EVENT_RECEIVED_STRUCT = _.struct('EventReceivedStruct', [ HEADER_COMMUNICATION, _.char('name', 100) ]);
const EVENT_STRUCT = _.struct('Event', [ _.char('name', 256), _.uint32le('size'), _.char('enable') ]);
const SET_PROTOCOL_PARAMETER = _.struct('SetProtocol', [ _.char('name', 100), _.int32le('protocol') ]);

const EVENT_TYPE = {
  CLIENT_AUTHENTICATION: {
    ID: 1,
    SIZE: 256,
    STRUCT: _.struct('ClientAuthenticationStruct', [ HEADER_COMMUNICATION, _.char('name', 256) ]),
  },
  REGISTER_EVENT: {
    ID: 2,
    SIZE: 261,
    STRUCT: _.struct('EventRegisterStruct', [ HEADER_COMMUNICATION, EVENT_STRUCT ]),
  },
  SEND_EVENT: {
    ID: 3,
    SIZE: 261,
    STRUCT: _.struct('EventSendStruct', [ HEADER_COMMUNICATION, EVENT_STRUCT ]),
  },
  SEND_PROTOCOL: {
    ID: 3,
    SIZE: 261,
    STRUCT: _.struct('SendProtocolStruct', [ HEADER_COMMUNICATION, SET_PROTOCOL_PARAMETER ]),
  },
};

type Event = {
  name: string,
  size?: number,
  type: string,
};

type Options = {
  verbose: boolean,
};

export { EVENT_STRUCT, EVENT_RECEIVED_STRUCT, EVENT_TYPE, HEADER_COMMUNICATION, SET_PROTOCOL_PARAMETER };
export type { Event, Options };
