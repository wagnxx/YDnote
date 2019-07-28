import { interfaces, provideThrowable, controller, httpGet, TYPE, inject, TAGS, Router } from "../ioc";
@controller("/")
@provideThrowable(TYPE.Controller, "IndexController")
export default class IndexController implements interfaces.Controller {
    @httpGet("/")
    private async index(ctx: Router.IRouterContext, next: () => Promise<any>) {
        ctx.body = await ctx.render("index");
    }
}