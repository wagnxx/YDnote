const extend =require('lodash').extend;
const join = require('path').join;


let config ={
    'viewDir':join(__dirname,"..","views"),
    'staticDir':join(__dirname,"..","acsess")
};


if(process.env.NODE_ENV=="development"){
    const localConfig ={
        port:'8081',
    }
    config = extend(config,localConfig);
}
if(process.env.NODE_ENV=="production"){
    const proConfig ={
        port:'80',
    }
    config = extend(config,proConfig);
}


module.exports = config;