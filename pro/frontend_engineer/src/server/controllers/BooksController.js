// import Books from "../models/Books";
import cheerio from "cheerio";
import { route, GET, POST } from "awilix-koa";
import { Readable } from "stream";

@route("/books")
class BooksController {
  constructor({ booksService }) {
    this.booksService = booksService;
  }
  @route("/add")
  @GET()
  async actionAdd(ctx, next) {
    ctx.body = await ctx.render("books/pages/add");
  }
  @route("/list")
  @GET()
  async actionList(ctx, next) {
    // const books = new Books({});
    let _result = await this.booksService.getData();

    const html = await ctx.render("books/pages/list", {
      data: _result.data
    });

    if (ctx.request.header["x-pjax"]) {
      ctx.status = 200;
      ctx.type = "html";
      // 站内跳
      const $ = cheerio.load(html);
      //   ctx.body = $("#js-hooks-data").html();
      let result = "";
      $(".pjaxcontext").each(function() {
        // result += $(this).html();
        ctx.res.write($(this).html());
      });
      $(".lazyload-js").each(function() {
        // result += `<script src="${$(this).attr("src")}"></script>`;
        // basket.js
        // ctx.res.write(`<script>activeJS(${$(this).attr("src")}")</script>`);
        ctx.res.write(`<script src="${$(this).attr("src")}"></script>`);
      });
      // ctx.body = result;
      ctx.res.end();
    } else {
      // 直接刷
      function createSSRStreamePromise() {
        return new Promise((resolve, reject) => {
          const htmlStream = new Readable();
          htmlStream.push(html);
          htmlStream.push(null);
          ctx.status = 200;
          ctx.type = "html";
          htmlStream
            .on("error", err => {
              reject(err);
            })
            .pipe(ctx.res);
        });
      }
      await createSSRStreamePromise();
      // ctx.body = html;
    }
  }
}

export default BooksController;
