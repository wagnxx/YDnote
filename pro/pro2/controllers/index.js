

const IndexController = require('./indexController');
const router = require('koa-simple-router');

let indexController = new IndexController();

module.exports = (app) => {

    app.use(router(_ => {
        _.get('/',indexController.actionIndex)

    }))
}





