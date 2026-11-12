const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method } = req;
  const url = req.originalUrl || req.url;

  logger.info({ method, url }, `--> ${method} ${url}`);

  res.on('finish', () => {
    const ms = Date.now() - start;
    const { statusCode } = res;
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger[level]({ method, url, statusCode, ms }, `<-- ${method} ${url} ${statusCode} - ${ms}ms`);
  });

  next();
};

module.exports = requestLogger;
