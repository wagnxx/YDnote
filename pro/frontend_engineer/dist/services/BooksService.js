"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @fileoverview 实现books 数据模型
 * @author wang
 *
 */
const SafeRequest = require("../utils/SafeRequest");

class BooksService {
  /**
   * Books 类 获取后台books相关数据
   */

  /**
   * @constructor
   * @param {object} app 执行上下文
   */
  constructor(app) {
    this.app = app;
  }
  /**
   * 获取后台全部图书列表
   * @param {*} optins 配置项
   * @example
   *
   */


  getData(optins) {
    //  const safeRequest = new SafeRequest('books/index');
    //  return safeRequest.fetch();
    let _result = {
      data: [{
        id: "001",
        name: "西游记",
        author: "吴先生"
      }, {
        id: "002",
        name: "水浒传",
        author: "施耐庵"
      }, {
        id: "003",
        name: "最佳女婿",
        author: "江夏林羽"
      }]
    };
    return Promise.resolve(_result);
  }

}

var _default = BooksService;
exports.default = _default;