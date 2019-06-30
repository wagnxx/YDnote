const Koa  = require('koa');
const server = require('koa-static');
const render = require('koa-swig');
var co = require('co');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler')
const app = new Koa();

const log4js = require('log4js');
const logger = log4js.getLogger();
log4js.configure({
  appenders: { cheese: { type: 'file', filename: './logs/yd.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});


app.use(server(config.staticDir))

errorHandler.error(app,logger);

require('./controllers')(app);

app.context.render = co.wrap(render({
    root:config.viewDir,
    autoescape:true,
    cache:false,
    ext:'html',
    writeBody:false,
    varControls:["[[","]]"]
}));

app.listen(config.port,()=>{
    console.log('success')
})