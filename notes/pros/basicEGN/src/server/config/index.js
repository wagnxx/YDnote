import {join} from 'path';

const config = {

	port:3000,
	staticDir:join(__dirname,'..','assets'),
	viewDir:join(__dirname,'..','views'),

};


export default config;
