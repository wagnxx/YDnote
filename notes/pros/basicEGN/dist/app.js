"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _awilix = require("awilix");

var _awilixKoa = require("awilix-koa");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _log4js = require("log4js");

var _errorHandler = require("./middlewares/errorHandler");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();
const container = (0, _awilix.createContainer)();
container.loadModules([__dirname + '/services/*Service.js'], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: _awilix.Lifetime.SCOPED
  }
});
app.use((0, _awilixKoa.scopePerRequest)(container));
(0, _log4js.configure)({
  appenders: {
    cheese: {
      type: 'file',
      filename: __dirname + '/logs/err.log'
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'error'
    }
  }
});
app.use((0, _koaStatic2.default)(_config2.default.staticDir));
const logger = (0, _log4js.getLogger)();
app.context.logger = logger;

_errorHandler2.default.error(app);

app.use((0, _awilixKoa.loadControllers)(__dirname + '/controllers/*.js'));
app.listen(_config2.default.port, () => {
  console.log(`koa server is running over ${_config2.default.port} `);
});
process.on('uncaughtException', function (err) {
  logger.error(err);
});
process.on('unhandledRejection', function (info) {
  logger.error(info.reason);
});
app.on('error', function (err) {
  logger.error(err);
});