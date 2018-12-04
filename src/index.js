// @flow
import { exec } from 'child_process';
import ServerConnection from './serverCommunication/ServerConnection';
import AI from './manager/AI';

require('dotenv').config();

/**
 * This function outputs the usage of the program.
 */
const displayUsage = () => {
  console.info(`
  Usage: yarn start [options]

  Displays help information and exit the program.
  
  Options:
  
      -h, --help                      output usage information
      -p <port>, --port=<port>        specify the port on which the plugin should connect to the server
  `);

  process.exit();
};

let standalone = false;
let standalonePort: number = 13300;
const standaloneHost: string = '127.0.0.1';

process.argv.forEach((val, index) => {
  if (val.startsWith('-standalone')) {
    standalone = true;
  }
  if (val.startsWith('--port=')) {
    standalonePort = parseInt(val.substr(7), 10);
  } else if (val === '-p' && process.argv.length > index) {
    standalonePort = parseInt(process.argv[index + 1], 10);
  } else if (val === '-h' || val === '--help') {
    displayUsage();
  } else if (index > 2 && process.argv[index - 1] !== '-p') {
    console.error(`Bad option: ${val}`);
    displayUsage();
  }
});
/*
exec(`/Applications/DNAI.app/Contents/MacOS/Server -p ${port}`);
const CoreDaemon = exec(`/Applications/DNAI.app/Contents/MacOS/Core/CoreDaemon -p ${port}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.info(`\nstdout: ${stdout}\n\n`);
  console.info(`\nstderr: ${stderr}\n\n`);
});

CoreDaemon.on('data', (data => console.info(data)));
*/
setTimeout(() => {
  /* eslint-disable no-new */
  if (standalone) {
    new ServerConnection(standaloneHost, standalonePort);
  }
}, 1000);

export default class DNAI {
  AIArray: Array<AI>;
  host: string;
  port: number;
  server: ServerConnection;
  isInitialized = false;

  constructor(host: string = '127.0.0.1', port: number = 13300) {
    this.host = host;
    this.port = port;
  }

  init = (file: string) =>
    new Promise((resolve, reject) => {
      const prefix = process.platform === 'darwin' ? 'mono ' : '';

      exec(`./Server/Server -p ${this.port}`);
      const CoreDaemon = exec(`${prefix}./Core/CoreDaemon.exe -p ${this.port}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(new Error('CoreDaemon error'));
        }
        console.info(`\nstdout: ${stdout}\n\n`);
        console.info(`\nstderr: ${stderr}\n\n`);
      });

      CoreDaemon.on('data', data => console.info(data));
      this.server = new ServerConnection(this.host, this.port, file, (AIArray: Array<AI>) => {
        this.AIArray = AIArray;
        resolve(AIArray);
      });
    });

  call = (name: string, params: {}, AIId: number = 0) => {
    if (this.AIArray.length > AIId) {
      return this.AIArray[AIId].call(name, params);
    }
    return new Promise((resolve, reject) => reject(new Error(`No AI at position ${AIId}`)));
  };

  setVariableValue = (name: string, params: {}, AIId: number = 0) => {
    if (this.AIArray.length > AIId) {
      return this.AIArray[AIId].setVariableValue(name, params);
    }
    return new Promise((resolve, reject) => reject(new Error(`No AI at position ${AIId}`)));
  };

  showDocumentation = (AIId: number = 0) => {
    if (this.AIArray.length > AIId) {
      return this.AIArray[AIId].getDocumentation();
    }
    return null;
  };
}
