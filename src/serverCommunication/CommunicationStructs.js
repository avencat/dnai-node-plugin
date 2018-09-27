// @flow
import _ from 'struct-fu';

const HEADER_COMMUNICATION = _.struct('Header', [
  _.int32le('magicNumber'),
  _.uint32le('packageSize'),
  _.uint32le('id'),
]);

const EVENT_STRUCT = _.struct('Event', [ _.char('name', 256), _.uint32le('size'), _.char('enable') ]);

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
};

type Event = {
  name: string,
  size: number,
  type: string,
};

export { EVENT_STRUCT, EVENT_TYPE, HEADER_COMMUNICATION };
export type { Event };
