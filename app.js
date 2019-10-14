'use stirct'

const koa = require('koa');
const app =  new koa();
const main = require('./src/main/main');

app
.use(main.routes())
.use(main.allowedMethods());

app.listen(8082);
console.log('http://localhost:8082/');