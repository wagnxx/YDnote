import {IApi} from '../interface/Api';
import {provide} from '../ioc';
import TAGS from '../constant/TAGS'
@provide(TAGS.ApiService)
export class ApiService implements IApi{
    private datas={
        data:'result'
    }
    getInfo(rul:string,arg?:object,callback?:Function):Promise<object>{
        return Promise.resolve(this.datas);
    }
}