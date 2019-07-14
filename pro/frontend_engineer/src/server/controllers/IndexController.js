

class IndexController {
    constructor(){

    }
    async actionIndex(ctx,next){
        ctx.body = await ctx.render('books/pages/index',{
            data:'hello ~~ sworld'
        });
    }
}

export default IndexController;