

const imageport = require('../ImagePort/imageport')

const util = {
    NowTime: new Date().getTime(),
    reply: async ($message, $token) => {

        let replys = '';

        if ($message.MsgType == "event") {
            replys = '';
            if ($message.Event === 'subscribe') { //订阅

                $message.EventKey ? console.log('扫码进入: ' + $message.EventKey + ' ' + $message.Ticket) : console.log('添加进入');

                replys = '<MsgType><![CDATA[text]]></MsgType>' +
                    '<Content><![CDATA[能再晚点吗，现在才关注我？\n这应该是全中国最糟糕的公众号，\n 我以捜罗全球创意领域的奇葩和 \n艺术界的败笔为乐趣，在毁灭你的 \n人生观、价值观同时向世界传递我 \n的虚情假意。\n(个人微信号：Sambay1226)\n回复神奇数字【1】\n开始吐糟→]]></Content>' +
                    '</xml>';

            } else if ($message.Event === 'unsubscribe') { //取消订阅

                replys = '<xml>' +
                    '<ToUserName><![CDATA[' + $message.FromUserName + ']]></ToUserName>' +
                    '<FromUserName><![CDATA[' + $message.ToUserName + ']]></FromUserName>' +
                    '<CreateTime>' + util.NowTime + '</CreateTime>' +
                    '<MsgType><![CDATA[text]]></MsgType>' +
                    '<Content><![CDATA[]]></Content>' +
                    '</xml>';

            } else if ($message.Event === 'SCAN') {//扫描
                console.log('看到你扫了一下奥: ' + $message.EventKey + $message.Ticket);

                replys = '<xml>' +
                    '<ToUserName><![CDATA[' + $message.FromUserName + ']]></ToUserName>' +
                    '<FromUserName><![CDATA[' + $message.ToUserName + ']]></FromUserName>' +
                    '<CreateTime>' + util.NowTime + '</CreateTime>' +
                    '<MsgType><![CDATA[text]]></MsgType>' +
                    '<Content><![CDATA[你扫了我公众号的二维码奥~]]></Content>' +
                    '</xml>';
            }

        } else if ($message.MsgType == "text") {
            if ($message.Content == 1) {
                replys = '<xml>' +
                    '<ToUserName><![CDATA[' + $message.FromUserName + ']]></ToUserName>' +
                    '<FromUserName><![CDATA[' + $message.ToUserName + ']]></FromUserName>' +
                    '<CreateTime>' + util.NowTime + '</CreateTime>' +
                    '<MsgType><![CDATA[' + $message.MsgType + ']]></MsgType>' +
                    '<Content><![CDATA[哇瑟~这么乖,尝试点点其他的数字奥~~~]]></Content>' +
                    '</xml>';
            } else if ($message.Content == 2) {
                let MediaId = await imageport.getMaterialImgUrl($token);
                
                replys = '<xml>' +
                    '<ToUserName><![CDATA[' + $message.FromUserName + ']]></ToUserName>' +
                    '<FromUserName><![CDATA[' + $message.ToUserName + ']]></FromUserName>' +
                    '<CreateTime>' + util.NowTime + '</CreateTime>' +
                    '<MsgType><![CDATA[image]]></MsgType>' +
                    '<Image>' +
                    '<MediaId><![CDATA[' + MediaId.media_id + ']]></MediaId>' +
                    '</Image>' +
                    '</xml>';
            } else {
                replys = '<xml>' +
                    '<ToUserName><![CDATA[' + $message.FromUserName + ']]></ToUserName>' +
                    '<FromUserName><![CDATA[' + $message.ToUserName + ']]></FromUserName>' +
                    '<CreateTime>' + util.NowTime + '</CreateTime>' +
                    '<MsgType><![CDATA[' + $message.MsgType + ']]></MsgType>' +
                    '<Content><![CDATA[嘤嘤嘤~~不知道客官在讲什么奥~~~]]></Content>' +
                    '</xml>';
            }
        } else if ($message.MsgType == "image") {//图片

            replys = '<xml>' +
                '<ToUserName><![CDATA[' + $message.FromUserName + ']]></ToUserName>' +
                '<FromUserName><![CDATA[' + $message.ToUserName + ']]></FromUserName>' +
                '<CreateTime>' + util.NowTime + '</CreateTime>' +
                '<MsgType><![CDATA[text]]></MsgType>' +
                '<Content><![CDATA[哇~~~ 你的审美有点东西奥~]]></Content>' +
                '</xml>';
        } else if ($message.MsgType == "voice") {

        }

        return replys;
    }
}


module.exports = util;