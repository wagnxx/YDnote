"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class IndexController {
  constructor() {}

  async actionIndex(ctx, next) {
    ctx.body = await ctx.render('books/pages/index', {
      data: 'hello ~~ sworld'
    });
  }

}

var _default = IndexController;
exports.default = _default;