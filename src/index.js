// @flow

import net from 'net';
import _ from 'struct-fu';

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

let port = 13300;
const host = '127.0.0.1';

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

const client = new net.Socket();
const magicNumber = process.env.MAGIC_NUMBER;

const HeaderCommunication = _.struct('HeaderCommunication', [
  _.int32('magicNumber'),
  _.uint32('packageSize'),
  _.uint32('id'),
]);

const helloWorld = HeaderCommunication.pack({
  magicNumber,
  packageSize: HeaderCommunication.size,
  id: 1,
});

client.connect(
  { port, host },
  () => {
    console.info(
      `Connected to ${host}:${port}, sending ${JSON.stringify(
        HeaderCommunication.unpack(helloWorld)
      )}`
    );
    client.write(helloWorld);
  }
);

client.on('data', data => {
  console.info(`Received: ${data}`);
});

client.on('close', () => {
  client.destroy();
  console.info('Connection closed');
});

export default displayUsage;
