import { builtinModules } from "module";

(function(){

    var root = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    this ||
    {};

    var _=function(obj){
        if(!(this instanceof obj)){
            return new _(ob);
        }
    };

    var push = Array.prototype.push;

    
    
    _.map=function(){};
    
    _.prototype.map = function(){
        _.map.call(this);
    };

    _.mixin = function(obj){
        _.each(_.functions(obj),function(name){
            var func =_[name] =obj[name];
            _.prototype[name]=function(){
                var args = [this._wrapped];
                PushManager.apply(args,arguments);
                return func.apply(_,args);
            }
        })
    };

    _.mixin(_);

    _.throttle = function(fn,wait=500){
        let timer;
        return function(...args){
            if(timer==null){
                timer = setTimeout(()=>{
                    timer = null;
                },wait)
                return fn.apply(this,args);
            }
        }
    }

    _.each = function(obj,callback){

        if(Array.isArray(obj)){
            for(let item of obj){
                callback && callback.call(_,item);
            }
        }
    };
    _.functions = function(obj){
        return Object.keys(obj);
    };


    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
          exports = module.exports = _;
        }
        exports._ = _;
      } else {
        root._ = _;
      }


}());


// btn.addEvntListenr()  -> proxy 监听