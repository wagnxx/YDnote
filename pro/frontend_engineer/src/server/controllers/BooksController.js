// import Books from "../models/Books";
import cheerio from "cheerio";
import {route,GET,POST} from 'awilix-koa'

@route("/books")
class BooksController {
  constructor({booksService}) {
    this.booksService=booksService;
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
      // 站内跳
      const $ = cheerio.load(html);
      //   ctx.body = $("#js-hooks-data").html();
      let result = "";
      $(".pjaxcontext").each(function() {
        result += $(this).html();
      });
      $(".lazyload-js").each(function() {
        result += `<script src="${$(this).attr("src")}"></script>`;
      });
      ctx.body = result;
    } else {
      // 直接刷
      ctx.body = html;
    }
  }
}

export default BooksController;
