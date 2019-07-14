const config = require('../config');
const fetch =require('node-fetch');

class SafeRequest {

    constructor(url){
        this.url = url;
        this.baseUrl = config.baseUrl;
    }
    fetch(){
        let result ={
            code:0,
            message:'',
            data:[]
        }
        return new Promise((resolve,reject)=>{
             
           let  ydfetch =fetch(this.baseUrl+this.url);
            ydfetch.then(res=>res.json())
            .then(json=>{
                result.data=json;
                console.log(result)
                resolve(result);
            }).catch(error=>{
                result.code=1;
                result.message = "node-feth请求失败";
                reject(result);
            })
        })
    }
}


export default SafeRequest;