import IndexController from "./IndexController";
import BooksController from "./BooksController";
const router = require("koa-simple-router");

let indexController = new IndexController();
let booksController = new BooksController();

export default app => {
  app.use(
    router(_ => {
      _.get("/", indexController.actionIndex);
      _.get("/index.html", indexController.actionIndex);
      _.get("/books/list", booksController.actionList);
    })
  );
};
