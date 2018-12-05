// @flow
// DNAI's Node.JS plugin
// DNAI: https://dnai.io
// DNAI's team: Quentin GASPAROTTO <https://www.linkedin.com/in/quentin-gasparotto>
//              Adrien WERY <https://www.linkedin.com/in/adrien-wery>
//              Axel VENCATAREDDY <https://www.linkedin.com/in/avencatareddy>
//              Louis VEZIA <https://www.linkedin.com/in/louis-vezia>
//              Fernand VEYRIER <https://www.linkedin.com/in/fernand-veyrier-26372596>
//              Matthieu TAVERNIER <https://www.linkedin.com/in/matthieu-tavernier-b5b6b8101>
//              Fiona ROCH <https://www.linkedin.com/in/fiona-roch>
//              Nicolas CONSTANTY <https://www.linkedin.com/in/nicolas-constanty-653232113>
//              Victor GOUET <https://www.linkedin.com/in/victor-gouet>
import { exec } from 'child_process';
import AI from './manager/AI';
import ServerConnection from './serverCommunication/ServerConnection';
import type { Options } from './serverCommunication/CommunicationStructs';

/**
 * This function outputs the usage of the program.
 */
const displayUsage = () => {
  console.info(`
  Usage: yarn start [options]

  Displays help information and exit the program.
  
  Options:
  
      -h, --help                          output usage information
      -p <port>, --port=<port>            specify the port on which the plugin should connect to the server
      --standalone                        launch the example program (load a .dnai file and display its documentation)
      --launchCore, --launchCoreDaemon    launch the CoreDaemon
      --launchServer                      launch the Server
      -f <file>, --file=<file>            specify the file to launch on standalone mode
      -v, --verbose                       activate the verbose mode
  `);

  process.exit();
};

let standalone = false;
let standaloneVerbose = false;
let standaloneLaunchServer = false;
let standaloneLaunchCoreDaemon = false;
let standalonePort: number = 13300;
let standaloneFile: string = '';
const standaloneHost: string = '127.0.0.1';

process.argv.forEach((val, index) => {
  if (val.startsWith('--standalone')) {
    standalone = true;
  } else if (val.startsWith('--launchCoreDaemon') || val.startsWith('--launchCore')) {
    standaloneLaunchCoreDaemon = true;
  } else if (val.startsWith('--launchServer')) {
    standaloneLaunchServer = true;
  } else if (val.startsWith('--port=')) {
    standalonePort = parseInt(val.substr(7), 10);
  } else if (val === '-p' && process.argv.length > index) {
    standalonePort = parseInt(process.argv[index + 1], 10);
  } else if (val.startsWith('--file=')) {
    standaloneFile = val.substr(7);
  } else if (val === '-f' && process.argv.length > index) {
    standaloneFile = process.argv[index + 1];
  } else if (val === '-v' || val === '--verbose') {
    standaloneVerbose = true;
  } else if (val === '-h' || val === '--help') {
    displayUsage();
  } else if (index > 2 && process.argv[index - 1] !== '-p' && process.argv[index - 1] !== '-f') {
    console.error(`Bad option: ${val}`);
    displayUsage();
  }
});

const standaloneLaunchDNAI = () => {
  /* eslint-disable no-new */
  new ServerConnection(
    standaloneHost,
    standalonePort,
    standaloneFile,
    async (AIArray: Array<AI>) => console.info(AIArray[0].getDocumentation()),
    { verbose: standaloneVerbose },
  );
};

if (standalone) {
  const prefix = process.platform === 'darwin' ? 'mono ' : '';

  if (standaloneLaunchServer) {
    const Server = exec(`./Server/Server -p ${standalonePort}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[SERVER] exec error: ${error}`);
      }
      console.info(`\n[SERVER] stdout: ${stdout}\n\n`);
      console.info(`\n[SERVER] stderr: ${stderr}\n\n`);
    });

    Server.on('data', data => console.info(`[SERVER] ${data}`));
  }

  if (standaloneLaunchCoreDaemon) {
    const CoreDaemon = exec(`${prefix}./Core/CoreDaemon.exe -p ${standalonePort}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[CORE_DAEMON] exec error: ${error}`);
      }
      console.info(`\n[CORE_DAEMON] stdout: ${stdout}\n\n`);
      console.info(`\n[CORE_DAEMON] stderr: ${stderr}\n\n`);
    });

    CoreDaemon.on('data', data => console.info(`[CORE_DAEMON] ${data}`));
  }

  if (!standaloneLaunchCoreDaemon && !standaloneLaunchServer) {
    standaloneLaunchDNAI();
  } else {
    setTimeout(standaloneLaunchDNAI, 1000);
  }
}

export default class DNAI {
  AIArray: Array<AI>;
  host: string;
  port: number;
  server: ServerConnection;
  options: Options;
  isInitialized = false;

  constructor(host: string = '127.0.0.1', port: number = 13300, options: Options = { verbose: false }) {
    this.host = host;
    this.port = port;
    this.options = options;
  }

  launchCore = () =>
    new Promise((resolve, reject) => {
      const prefix = process.platform === 'darwin' ? 'mono ' : '';

      const CoreDaemon = exec(`${prefix}./Core/CoreDaemon.exe -p ${this.port}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(new Error(`CoreDaemon error: ${error}`));
        }
        console.info(`\nstdout: ${stdout}\n\n`);
        console.info(`\nstderr: ${stderr}\n\n`);
      });

      CoreDaemon.on('data', data => console.info(data));
      resolve();
    });

  launchServer = () =>
    new Promise((resolve, reject) => {
      const Server = exec(`./Server/Server -p ${this.port}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`[SERVER] exec error: ${error}`);
          reject(new Error(`Server error: ${error}`));
        }
        console.info(`\n[SERVER] stdout: ${stdout}\n\n`);
        console.info(`\n[SERVER] stderr: ${stderr}\n\n`);
      });

      Server.on('data', data => console.info(`[SERVER] ${data}`));
    });

  init = (file: string) =>
    new Promise((resolve, reject) => {
      try {
        this.server = new ServerConnection(
          this.host,
          this.port,
          file,
          (AIArray: Array<AI>) => {
            this.AIArray = AIArray;
            resolve(AIArray);
          },
          this.options,
        );
      } catch (e) {
        reject(e);
      }
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
