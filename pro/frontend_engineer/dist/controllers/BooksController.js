"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const Books = require('../models/Books');

class BooksController {
  constructor() {}

  async actionList(ctx, next) {
    const books = new Books({});
    let result = await books.getData(); // result= JSON.parse(result)
    // result.result.data;

    ctx.body = await ctx.render('books/pages/list', {
      data: result.data
    });
  }

}

var _default = BooksController;
exports.default = _default;