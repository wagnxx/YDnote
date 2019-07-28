import TAGS from '../constant/TAGS';
import * as Router from "koa-router";
import { fluentProvide } from "inversify-binding-decorators";
export {
    Container,inject
} from 'inversify';
export {provide,buildProviderModule,
    
} from "inversify-binding-decorators"
 

const provideThrowable =function(identity,name){
    return fluentProvide(identity)
    .whenTargetNamed(name)
    .done();
}

export {
    interfaces,
    controller,
    httpGet,
    TYPE
} from 'inversify-koa-utils';

export {
    TAGS,
    Router,
    provideThrowable
}