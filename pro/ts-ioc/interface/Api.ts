export interface IApi{
    getInfo(rul:string,arg?:object,callback?:Function):Promise<object>
}