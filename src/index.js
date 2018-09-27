// @flow
import ServerConnection from './serverCommunication/ServerConnection';

require('dotenv').config();

/**
 * This function outputs the usage of the program.
 */
const displayUsage = () => {
  console.info(`
  Usage: node index.js [options]

  Displays help information and exit the program.
  
  Options:
  
      -h, --help                      output usage information
      -p <port>, --port=<port>        specify the port on which the plugin should connect to the server
  `);

  process.exit();
};

let port: number = 13300;
const host: string = '127.0.0.1';

process.argv.forEach((val, index) => {
  if (val.startsWith('--port=')) {
    port = parseInt(val.substr(7), 10);
  } else if (val === '-p' && process.argv.length > index) {
    port = parseInt(process.argv[index + 1], 10);
  } else if (val === '-h' || val === '--help') {
    displayUsage();
  } else if (index > 2 && process.argv[index - 1] !== '-p') {
    console.error(`Bad option: ${val}`);
    displayUsage();
  }
});

/* eslint-disable no-new */
new ServerConnection(host, port);

export default displayUsage;
