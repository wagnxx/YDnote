

class IndexController {
    constructor(){

    }
    async actionIndex(ctx,next){
        ctx.body = await ctx.render('books/index',{
            data:'hello world'
        });
    }
}

module.exports = IndexController;