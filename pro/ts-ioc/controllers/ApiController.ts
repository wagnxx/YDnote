import {
    interfaces,
    controller,
    httpGet,
    TYPE,
    inject,
    TAGS,
    Router,
    provideThrowable
} from '../ioc'
import { IApi } from '../interface/Api';


@controller('/api')
@provideThrowable(TYPE.Controller, 'ApiConroller')

export default class ApiConroller implements interfaces.Controller {
    private apiService: IApi;
    constructor(@inject(TAGS.ApiService) apiService) {
        this.apiService = apiService;
    }
    @httpGet('/test')
    private async test(ctx: Router.IRouterContext) {
        ctx.body = await ctx.render('index');
    }
}