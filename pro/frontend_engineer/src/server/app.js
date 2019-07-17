import Koa from 'koa';
import server from 'koa-static';
import render from 'koa-swig';
import { wrap } from 'co';
import config from './config';
import errorHandler from './middlewares/errorHandler';
const app = new Koa();

import { getLogger, configure } from 'log4js';
import {createContainer,Lifetime} from 'awilix'
import {loadControllers,scopePerRequest} from 'awilix-koa'

// 把service融入到容器中
const container = createContainer();
container.loadModules([__dirname+'/services/*.js'],{
  formatName:'camelCase',
  resolverOptions:{
    lifetime: Lifetime.SCOPED,
  }
});
// 终极注入
app.use(scopePerRequest(container));

configure({
  appenders: { cheese: { type: 'file', filename: __dirname+'/logs/yd.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});


app.use(server(config.staticDir))

const logger = getLogger();
app.context.logger = logger;
errorHandler.error(app);
 

app.context.render = wrap(render({
    root:config.viewDir,
    autoescape:true,
    cache:false,
    ext:'html',
    writeBody:false,
    varControls:["[[","]]"]
}));

app.use(loadControllers(__dirname+'/controllers/*.js'))

app.listen(config.port,()=>{
     console.log('success running over'+config.port)
})