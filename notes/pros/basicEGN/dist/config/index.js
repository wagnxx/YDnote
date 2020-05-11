"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

const config = {
  port: 3000,
  staticDir: (0, _path.join)(__dirname, '..', 'assets'),
  viewDir: (0, _path.join)(__dirname, '..', 'views')
};
exports.default = config;