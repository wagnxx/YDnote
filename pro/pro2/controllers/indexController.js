class IndexController {
    constructor(){

    }
    async actionIndex(ctx,next){
        ctx.body = await ctx.render('books/index');
    }
}

module.exports = IndexController;