// @flow
import net from 'net';
import { EVENT_TYPE } from './CommunicationStructs';
import type { Event } from './CommunicationStructs';
import Events from './events.json';

class ServerConnection {
  constructor(host: string, port: number) {
    this.connect(host, port);
  }

  client = new net.Socket();
  magicNumber = process.env.MAGIC_NUMBER;

  onReceived = (data: string) => {
    console.info(`Received: ${data}`);
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

  connect = (host: string, port: number) => {
    this.client.connect({ port, host });

    this.client.on('connect', () => {
      console.info(`\n[INFO] Connected to ${host}:${port}.\n`);

      Events.forEach((event) => {
        this.sendPackage[event.type](event);
      });
    });

    this.client.on('data', this.onReceived);

    this.client.on('close', this.disconnect);
  };

  disconnect = () => {
    this.client.destroy();
    console.info('Connection closed');
  };
}

export default ServerConnection;
