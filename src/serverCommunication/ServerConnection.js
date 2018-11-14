// @flow
import net from 'net';
import Events from './events.json';
import Utils from '../utils/Utils';
import { EVENT_TYPE } from './CommunicationStructs';
import type { Event } from './CommunicationStructs';
import EventsManager from '../manager/EventsManager';

export default class ServerConnection {
  constructor(host: string, port: number) {
    this.connect(host, port);
  }

  client = new net.Socket();
  magicNumber = process.env.MAGIC_NUMBER;
  eventManager = new EventsManager();

  onReceived = (data: Buffer) => {
    const dataReceived = EVENT_TYPE.SEND_EVENT.STRUCT.unpack(data);

    console.info(`[INFO] Network.received(${JSON.stringify(dataReceived.Event.name)})`);

    this.eventManager.process(
      Utils.getFirstWord(dataReceived.Event.name),
      Utils.getStringAfterFirstWord(dataReceived.Event.name),
      dataReceived.Event,
      this.sendResponse,
    );
  };

  sendEvent = (event: Event, enable: string) => {
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

      this.sendEvent(event, '1');
    },
    SEND_EVENT: (event: Event) => {
      console.info(`[INFO] Sending event ${event.name}`);

      this.sendEvent(event, '1');
    },
  };

  sendResponse = (name: string) => this.sendPackage.SEND_EVENT({ name, size: 261, type: 'SEND_EVENT' });

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
