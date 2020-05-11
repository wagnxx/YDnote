import { route, GET } from 'awilix-koa';

@route('')
@route('/')
@route('/index')
export default class IndexController {
  constructor({ indexService }) {
    this.indexService = indexService;
  }

  @route('/hello')
  @GET()
  async test(ctx, next) {
    ctx.body = await this.indexService.getData();
    // ctx.body = 2222;
  }
}
