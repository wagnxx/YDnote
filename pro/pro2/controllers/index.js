

const IndexController = require('./indexController');
const BooksController = require('./BooksController');
const router = require('koa-simple-router');

let indexController = new IndexController();
let booksController = new BooksController();

module.exports = (app) => {

    app.use(router(_ => {
        _.get('/',indexController.actionIndex);
        _.get('/index.html',indexController.actionIndex);
        _.get('/books/list',booksController.actionList);

    }))
}





