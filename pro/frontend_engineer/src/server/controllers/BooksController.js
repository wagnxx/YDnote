const Books = require('../models/Books')


class BooksController {
    constructor(){

    }
    async actionList(ctx,next){
        const books = new Books({

        });
        let result = await books.getData();

        // result= JSON.parse(result)
        // result.result.data;
        ctx.body = await ctx.render('books/pages/list',{
            data:result.data
        });
    }
}

export default BooksController;