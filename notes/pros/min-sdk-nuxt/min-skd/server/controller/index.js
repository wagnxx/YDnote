const Router = require("@koa/router");

module.exports = function controllers(app) {
  const router = new Router();
  router.get("/index", require("./indexController"));
  router.get("/api", require("./apiController"));
  app.use(router.routes()).use(router.allowedMethods());
};
