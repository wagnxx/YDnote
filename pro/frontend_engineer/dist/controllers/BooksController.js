"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cheerio = _interopRequireDefault(require("cheerio"));

var _awilixKoa = require("awilix-koa");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let BooksController = (_dec = (0, _awilixKoa.route)("/books"), _dec2 = (0, _awilixKoa.route)("/add"), _dec3 = (0, _awilixKoa.GET)(), _dec4 = (0, _awilixKoa.route)("/list"), _dec5 = (0, _awilixKoa.GET)(), _dec(_class = (_class2 = class BooksController {
  constructor({
    booksService
  }) {
    this.booksService = booksService;
  }

  async actionAdd(ctx, next) {
    ctx.body = await ctx.render("books/pages/add");
  }

  async actionList(ctx, next) {
    // const books = new Books({});
    let _result = await this.booksService.getData();

    const html = await ctx.render("books/pages/list", {
      data: _result.data
    });

    if (ctx.request.header["x-pjax"]) {
      // 站内跳
      const $ = _cheerio.default.load(html); //   ctx.body = $("#js-hooks-data").html();


      let result = "";
      $(".pjaxcontext").each(function () {
        result += $(this).html();
      });
      $(".lazyload-js").each(function () {
        result += `<script src="${$(this).attr("src")}"></script>`;
      });
      ctx.body = result;
    } else {
      // 直接刷
      ctx.body = html;
    }
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "actionAdd", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "actionAdd"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "actionList", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "actionList"), _class2.prototype)), _class2)) || _class);
var _default = BooksController;
exports.default = _default;