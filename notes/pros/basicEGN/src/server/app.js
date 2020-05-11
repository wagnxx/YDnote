import Koa from 'koa';
import serve from 'koa-static';
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
import config from './config';
import { getLogger, configure } from 'log4js';
import errorHandler from './middlewares/errorHandler';

const app = new Koa();
const container = createContainer();

container.loadModules([__dirname + '/services/*Service.js'], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
});
app.use(scopePerRequest(container));

configure({
  appenders: {
    cheese: { type: 'file', filename: __dirname + '/logs/err.log' },
  },
  categories: { default: { appenders: ['cheese'], level: 'error' } },
});

app.use(serve(config.staticDir));

const logger = getLogger();
app.context.logger = logger;
errorHandler.error(app);

app.use(loadControllers(__dirname + '/controllers/*.js'));

app.listen(config.port, () => {
  console.log(`koa server is running over ${config.port} `);
});

process.on('uncaughtException', function (err) {
  logger.error(err);
});
process.on('unhandledRejection', function (info) {
  logger.error(info.reason);
});

app.on('error', function (err) {
  logger.error(err);
});
