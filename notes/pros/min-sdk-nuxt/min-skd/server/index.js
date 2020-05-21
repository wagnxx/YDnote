const Koa = require("koa");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = app.env !== "production";

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || "127.0.0.1",
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  await nuxt.ready();
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // app.use(async(ctx,next)=>{
  //   let apis=['/api','/api/'];
  //   if(apis.includes(ctx.url)){

  //     ctx.body='hello world';
  //   }else{

  //     next();
  //   }
  // })
  require("./controller")(app);
  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  require('./socket').io(io);

  server.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
