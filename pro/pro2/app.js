const Koa  = require('koa');
const server = require('koa-static');
const render = require('koa-swig');
var co = require('co');
const config = require('./config');

const app = new Koa();

// app.use(server(config.staticDir))


require('./controllers')(app);

app.context.render = co.wrap(render({
    root:config.viewDir,
    autoescape:true,
    cache:false,
    ext:'html',
    writeBody:false
}));

 



console.log(config)

app.listen(config.port,()=>{
    console.log('success')
})