"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koaSwig = _interopRequireDefault(require("koa-swig"));

var _co = require("co");

var _config = _interopRequireDefault(require("./config"));

var _errorHandler = _interopRequireDefault(require("./middlewares/errorHandler"));

var _log4js = require("log4js");

var _awilix = require("awilix");

var _awilixKoa = require("awilix-koa");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa.default();
// 把service融入到容器中
const container = (0, _awilix.createContainer)();
container.loadModules([__dirname + '/services/*.js'], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: _awilix.Lifetime.SCOPED
  }
}); // 终极注入

app.use((0, _awilixKoa.scopePerRequest)(container));
(0, _log4js.configure)({
  appenders: {
    cheese: {
      type: 'file',
      filename: __dirname + '/logs/yd.log'
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'error'
    }
  }
});
app.use((0, _koaStatic.default)(_config.default.staticDir));
const logger = (0, _log4js.getLogger)();
app.context.logger = logger;

_errorHandler.default.error(app);

app.context.render = (0, _co.wrap)((0, _koaSwig.default)({
  root: _config.default.viewDir,
  autoescape: true,
  cache: false,
  ext: 'html',
  writeBody: false,
  varControls: ["[[", "]]"]
}));
app.use((0, _awilixKoa.loadControllers)(__dirname + '/controllers/*.js'));
app.listen(_config.default.port, () => {
  console.log('success running over' + _config.default.port);
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