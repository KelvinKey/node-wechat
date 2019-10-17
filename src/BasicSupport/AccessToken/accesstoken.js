'use strict'

const fs = require('fs');
const util = require("util");
const bluebird = require('bluebird');
//该操作可以将原本的request方法封装成一个promise函数
const request = bluebird.promisify(require('request'));
const config = require(__dirname.split('src')[0] + 'config.json');

const weChat = {

    /**fetch Token */
    access_token: '',
    /**获取Token
     * flag: 'w'会清空文件然后写入
     * flag: 'r' 代表读取文件
     */
    fetchAccessToken: () => {

        let $url = util.format(config.apiURL.accessTokenApi, config.prefix, config.appID, config.AppSecret);

        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/token.txt', { flag: 'r+', encoding: 'utf8' }, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                if (data.length != 0 && eval('(' + data + ')').expires_in > (new Date().getTime())) {
                    weChat.access_token = eval('(' + data + ')').access_token || '';
                    resolve(data);                
                } else {
                    request({ url: $url, json: true }).then(response => {
                        let $ = response.body;
                        weChat.access_token = $.access_token || '';
                        $.expires_in = new Date().getTime() + 7100 * 1000;

                        fs.writeFile(__dirname + '/token.txt', JSON.stringify($), { flag: 'w' }, err => {
                            err ? reject(err) : resolve($);
                        });
                    })
                }
            })
        });

    }
}

module.exports = weChat;