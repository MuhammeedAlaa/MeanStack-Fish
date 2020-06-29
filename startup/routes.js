const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const express = require('express');
const path = require('path');
const cors = require('cors');

const adminRouter = require('../routes/adminRouter');
const fishRouter = require('../routes/fishRouter');
const orderRouter = require('../routes/orderRouter');

const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');

module.exports = function (app) {
  app.use(cors());
  app.use(compression());
  app.options('*', cors());
  app.use(helmet());
  app.use(morgan('combined'));
  app.set('trust proxy', 'loopback'); // for deployment to get the host in the code
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json({ extended: true, limit: '50mb' }));

  // static files
  app.use(express.static(path.join(__dirname, '../public')));

  // apis
  app.use('/api/v1/users', adminRouter);
  app.use('/api/v1/fishes', fishRouter);
  app.use('/api/v1/orders', orderRouter);

  app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  // if any link is visited and not mentioned above will go to that next middleware
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  app.use(globalErrorHandler);
};
