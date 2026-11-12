const pino = require('pino');

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development' || (!process.env.NODE_ENV && !isTest);

const options = {
  level: isTest ? 'silent' : 'info',
};

if (isDev && !isTest) {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
    },
  };
}

const logger = pino(options);

module.exports = logger;
