const Books = require('../models/Books')


class IndexController {
    constructor(){

    }
    async actionList(ctx,next){
        const books = new Books({

        });
        let result = await books.getData();

        // result= JSON.parse(result)
        // result.result.data;
        ctx.body = await ctx.render('books/list',{
            data:result.data
        });
    }
}

module.exports = IndexController;