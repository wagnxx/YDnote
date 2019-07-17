
import {route,GET,POST} from 'awilix-koa'
@route("/")
class IndexController {
    constructor(){

    }
    @route("/")
    @GET()
    async actionIndex(ctx,next){
        ctx.body = await ctx.render('books/pages/index',{
            data:'hello ~~ sworld'
        });
    }
}

export default IndexController;