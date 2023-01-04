const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./api/routes');
const { globalErrorHandler } = require('./api/utils/error');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  app.use(routes);
  app.use(globalErrorHandler);
  app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'pong' });
  });

  return app;
};

module.exports = { createApp };
