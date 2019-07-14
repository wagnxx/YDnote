"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koaSwig = _interopRequireDefault(require("koa-swig"));

var _co = require("co");

var _config = _interopRequireDefault(require("./config"));

var _errorHandler = _interopRequireDefault(require("./middlewares/errorHandler"));

var _controllers = _interopRequireDefault(require("./controllers"));

var _log4js = require("log4js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa.default();
const logger = (0, _log4js.getLogger)();
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

_errorHandler.default.error(app, logger);

(0, _controllers.default)(app);
app.context.render = (0, _co.wrap)((0, _koaSwig.default)({
  root: _config.default.viewDir,
  autoescape: true,
  cache: false,
  ext: 'html',
  writeBody: false,
  varControls: ["[[", "]]"]
}));
app.listen(_config.default.port, () => {
  console.log('success running over' + _config.default.port);
});