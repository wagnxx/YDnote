"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class IndexService {
  constructor() {
    this.result = [{
      title: 'vue'
    }, {
      title: 'webpack'
    }, {
      title: 'react'
    }];
  }

  getData() {
    return Promise.resolve(this.result);
  }

}

exports.default = IndexService;