"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IndexController = _interopRequireDefault(require("./IndexController"));

var _BooksController = _interopRequireDefault(require("./BooksController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = require("koa-simple-router");

let indexController = new _IndexController.default();
let booksController = new _BooksController.default();

var _default = app => {
  app.use(router(_ => {
    _.get("/", indexController.actionIndex);

    _.get("/index.html", indexController.actionIndex);

    _.get("/books/list", booksController.actionList);
  }));
};

exports.default = _default;