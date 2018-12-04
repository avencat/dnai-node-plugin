// @flow
import net from 'net';
import _ from 'struct-fu';
import AI from '../manager/AI';
import Events from './events.json';
import Utils from '../utils/Utils';
import type { DataReceivedType } from './AIObjects';
import type { Event } from './CommunicationStructs';
import EventsManager from '../manager/EventsManager';
import { EVENT_RECEIVED_STRUCT, EVENT_TYPE, HEADER_COMMUNICATION } from './CommunicationStructs';

export default class ServerConnection {
  file: ?string;
  isReady: ?Function;

  AIArray: Array<AI> = [];
  client = new net.Socket();
  magicNumber = process.env.MAGIC_NUMBER;
  eventManager = new EventsManager();

  constructor(host: string, port: number, file: ?string = null, isReady: ?Function = null) {
    this.file = file;
    this.isReady = isReady;

    this.connect(
      host,
      port,
    );
  }

  onReceived = (data: Buffer) => {
    const eventReceived = EVENT_RECEIVED_STRUCT.unpack(data);
    const dataReceived = _.struct('EventReceived', [
      HEADER_COMMUNICATION,
      _.struct('Event', [ _.char('name', 100), _.char('data', eventReceived.Header.packageSize - 100) ]),
    ]).unpack(data);

    console.info(`[INFO] Network.received(${JSON.stringify(dataReceived.Event.name)})`);

    if (dataReceived.Event.name === 'GLOBAL.LOADED') {
      const jsonArray = `[${dataReceived.Event.data.split('}{').join('},{')}]`;
      const dataArray = JSON.parse(jsonArray);

      dataReceived.Event.data = {
        sent: dataArray[0],
        response: dataArray[1],
      };

      this.eventManager.GLOBAL.loaded(dataReceived.Event, this.sendResponse, this.AIArray).then(() => {
        console.info('AI is ready!');
      });
    } else {
      this.processResponse(dataReceived);
    }
  };

  processResponse = (dataReceivedImmutable: DataReceivedType) => {
    const dataReceived = {};
    Object.assign(dataReceived, dataReceivedImmutable);

    if (dataReceived.Event.name === 'GLOBAL.PROTOCOL_SET') {
      this.sendEvent(
        { name: 'GLOBAL.LOAD_FROM', type: 'SEND_EVENT' },
        JSON.stringify({ Filename: `${process.cwd()}/moreorless30.dnai` }),
      );
    } else {
      const jsonArray = `[${dataReceived.Event.data.split('}{').join('},{')}]`;
      const dataArray = JSON.parse(jsonArray);

      dataReceived.Event.data = {
        sent: dataArray[0],
        response: dataArray[1],
      };
    }

    this.eventManager.process(
      Utils.getFirstWord(dataReceived.Event.name),
      Utils.getStringAfterFirstWord(dataReceived.Event.name),
      dataReceived.Event,
      this.sendResponse,
      this.AIArray,
    );
  };

  registerEvent = (event: Event, enable: string) => {
    this.client.write(EVENT_TYPE[event.type].STRUCT.pack({
      Header: {
        magicNumber: this.magicNumber,
        packageSize: event.size || EVENT_TYPE[event.type].SIZE,
        id: EVENT_TYPE[event.type].ID,
      },
      Event: {
        name: event.name,
        size: event.size,
        enable,
      },
    }));
  };

  sendEvent = (event: Event, data: string) => {
    const SEND_EVENT_STRUCT = _.struct('SendEventStruct', [
      HEADER_COMMUNICATION,
      _.struct('Event', [ _.char('name', 100), _.char('data', data.length) ]),
    ]);

    this.client.write(SEND_EVENT_STRUCT.pack({
      Header: {
        magicNumber: this.magicNumber,
        packageSize: 100 + data.length,
        id: EVENT_TYPE[event.type].ID,
      },
      Event: {
        name: event.name,
        data,
      },
    }));
  };

  sendJSONProtocol = (event: Event) => {
    const pack = EVENT_TYPE.SEND_PROTOCOL.STRUCT.pack({
      Header: {
        magicNumber: this.magicNumber,
        packageSize: 104,
        id: EVENT_TYPE[event.type].ID,
      },
      SetProtocol: {
        name: event.name,
        protocol: 1,
      },
    });

    this.client.write(pack);
  };

  sendPackage = {
    CLIENT_AUTHENTICATION: (event: Event) => {
      console.info(`[INFO] Authenticate ${event.name}\n`);

      this.client.write(EVENT_TYPE[event.type].STRUCT.pack({
        Header: {
          magicNumber: this.magicNumber,
          packageSize: EVENT_TYPE.CLIENT_AUTHENTICATION.SIZE,
          id: EVENT_TYPE.CLIENT_AUTHENTICATION.ID,
        },
        name: event.name,
      }));
    },
    REGISTER_EVENT: (event: Event) => {
      console.info(`[INFO] Registering event ${event.name}`);

      this.registerEvent(event, '1');
    },
    SEND_EVENT: (event: Event, data: string) => {
      console.info(`[INFO] Sending event ${event.name}`);

      this.sendEvent(event, data);
    },
    SEND_PROTOCOL: (event: Event) => {
      console.info(`[INFO] Sending event ${event.name}`);

      this.sendJSONProtocol(event);
    },
  };

  sendResponse = (name: string, data: string) =>
    this.sendPackage.SEND_EVENT({ name, size: 261, type: 'SEND_EVENT' }, data);

  connect = (host: string, port: number) => {
    this.client.connect({ port, host });

    this.client.on('data', this.onReceived);

    this.client.on('close', this.disconnect);

    this.client.on('connect', () => {
      console.info(`\n[INFO] Connected to ${host}:${port}.\n`);

      Events.forEach((event) => {
        this.sendPackage[event.type](event);
      });
    });
  };

  disconnect = () => {
    this.client.destroy();
    console.info('Connection closed');
  };
}
