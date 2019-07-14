import Koa from 'koa';
import server from 'koa-static';
import render from 'koa-swig';
import { wrap } from 'co';
import config from './config';
import errorHandler from './middlewares/errorHandler';
const app = new Koa();
import controllerInit from './controllers';
import { getLogger, configure } from 'log4js';
const logger = getLogger();
configure({
  appenders: { cheese: { type: 'file', filename: __dirname+'/logs/yd.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});


app.use(server(config.staticDir))

errorHandler.error(app,logger);

controllerInit(app);

app.context.render = wrap(render({
    root:config.viewDir,
    autoescape:true,
    cache:false,
    ext:'html',
    writeBody:false,
    varControls:["[[","]]"]
}));

app.listen(config.port,()=>{
     console.log('success running over'+config.port)
})