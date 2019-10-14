'use strict'

const router = require('koa-router')();
const rawBody = require('raw-body');
const sha1 = require('sha1');
const _Token = require('../BasicSupport/AccessToken/accesstoken');
const _Ticket = require('../BasicSupport/AccessTicket/accessticket');
const config = require(__dirname.split('src')[0] + 'config.json');


/**Configuration information */
router.get('/', async res => {

    const hash = sha1([config.token || '', res.query.timestamp || '', res.query.nonce || ''].sort().join(''));

    res.body = (hash == res.query.signature || '') ? (res.query.echostr || '') + '' : 'failed';

    _Token.fetchAccessToken();

    console.log(hash + "==" + res.query.signature);
});

/**get fetch Ticket */
router.get('/get', async ctx => {
    let ticket = await _Ticket.fetchTicket(_Token.access_token);
    let params = sort.sign(ticket.ticket, ctx.href);
    console.log(ticket.ticket + "-------" + params.signature)
    // ctx.body = ejs.render(xml, params);
});


const sort = {
    sign: (ticket, url) => {
        let params = [
            'jsapi_ticket=' + ticket,
            'noncestr=' + sort.createNonce(),
            'timestamp=' + sort.createTimestamp() + '',
            'url=' + url
        ];

        return {
            noncestr: sort.createNonce(),
            timestamp: sort.createTimestamp(),
            signature: sha1(params.sort().join('&'))
        }
    },
    /**生成随机字符串 */
    createNonce: () => {
        return Math.random().toString(36).substr(2, 15);
    },
    /**生成时间戳 */
    createTimestamp: () => {
        return parseInt(new Date().getTime() / 1000);
    },

}

module.exports = router;