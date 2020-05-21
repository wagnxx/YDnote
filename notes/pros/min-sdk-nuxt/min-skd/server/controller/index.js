const Router = require("@koa/router");
const apiController = require("./apiController");
module.exports = function controllers(app) {
  const router = new Router();
  router.get("/index", require("./indexController"));
  router.get("/api", apiController.api);
  router.get("/api/chat", apiController.chat_get);
  router.options("/api/chat", apiController.chat_get);
  router.post("/api/chat", apiController.chat_post);
  app.use(router.routes()).use(router.allowedMethods());
};
