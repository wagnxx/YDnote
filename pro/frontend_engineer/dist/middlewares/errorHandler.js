"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const errorHandler = {
  error(app, logger) {
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        logger.error(error);
        ctx.status = error.status || 500;
        ctx.body = error;
      }
    });
    app.use(async (ctx, next) => {
      await next();

      if (ctx.status !== 404) {
        return;
      } else {
        ctx.status = 404;
        ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>';
      }
    });
  }

};
var _default = errorHandler;
exports.default = _default;