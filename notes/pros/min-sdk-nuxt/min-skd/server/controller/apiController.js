// module.exports = async function apiController(ctx, next) {
//   // ctx.router available
//   ctx.body = "api route!!";
// };

let clients = [];

module.exports = {
  api: async (ctx, next) => {
    // ctx.router available
    ctx.body = "api route!!";
  },
  chat_post: async (ctx, next) => {

    return;
    let body = "";
    ctx.req.on("data", function(chunk) {
      body += chunk;
    });

    ctx.req.on("end", function() {
      res.head(200);
      message = "data:" + body.replace("\n", "\ndata:") + "\r\n\r\n";
      clients.forEach(client => client.write(message));
    });
  },
  chat_get: async (ctx, next) => {
    ctx.res.head(200);
    ctx.type = "text/event-stream";
    ctx.res.write("data: Connected\n\n");
    ctx.req.connection.on("end", function() {
      clients.splice(clients.indexOf(ctx.res), 1);
      ctx.res.end();
    });
    clients.push(ctx.res);
  }
};
