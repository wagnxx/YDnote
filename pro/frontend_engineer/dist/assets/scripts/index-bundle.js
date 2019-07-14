"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var data, app;
  return {
    setters: [],
    execute: function () {
      data = {
        code: 200,
        msg: "hell"
      };
      app = new Vue({
        el: '#app6',
        data: {
          message: 'Hello Vue!'
        }
      }); // module.exports = data;

      _export("default", data);
    }
  };
});