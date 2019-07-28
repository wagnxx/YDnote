import 'reflect-metadata';
import { Container, buildProviderModule } from './ioc';
import './ioc/inversify.config';
import { InversifyKoaServer } from 'inversify-koa-utils';

import * as serve from "koa-static";
import * as render from "koa-swig";
import { wrap } from 'co';
import config from "./config";
import { historyApiFallback } from 'koa2-connect-history-api-fallback';

const container = new Container();
container.load(buildProviderModule())
const server = new InversifyKoaServer(container);

server.setConfig(app => {
    app.context.render = wrap(render({
        root: config.viewDir,
        autoescape: true,
        varControls: ["[[", "]]"],
        // cache: 'memory', // disable, set to false
        cache: false,
        ext: 'html',
        writeBody: false
    }));
    app.use(serve(config.staticDir));
    app.use(historyApiFallback({ index: "/", whiteList: ['/api'] }));
})

const app = server.build();

app.listen(config.port, () => {
    console.log("sever is running on "+config.port)
})