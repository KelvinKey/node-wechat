'use  strict'

const fs = require('fs');
const path = require('path');
const util = require('util');
const request = require('request');
//该操作可以将原本的request方法封装成一个promise函数
const bluebird = require('bluebird').promisify(request);
const config = require(__dirname.split('src')[0] + 'config.json');

const port = {

    //新增永久素材
    getMaterialImgUrl: $token => {

        console.log(`$token:` + $token);

        return new Promise((resolve, reject) => {

            let formData = { media: port.WallpaperPicture() };
            let options = { method: 'POST', url: util.format(config.permanent.getImgUrl, config.prefix, $token), formData: formData, json: true };

            port.httpRequest(options, 'getMaterialImgUrl').then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**获取素材地址 */
    WallpaperPicture: () => {
        bluebird({ url: config.bing, json: true }).then(data => {

            let readStream = request(data.body.data.url);
            let writeStream = fs.createWriteStream(__dirname + '/img/image.jpg');
            readStream.pipe(writeStream);

        }).catch(err => {

            console.log(err);
        });
        return fs.createReadStream(path.join(__dirname, './img/image.jpg'));
    },

    //http处理函数
    httpRequest: (options, msg) => {
        return new Promise((resolve, reject) => {
            bluebird(options).then(function (response) {
                let _data = response.body
                if (_data) {
                    resolve(_data);
                } else {
                    throw new Error(msg + '  error');
                }
            }).catch(err => {
                reject(err);
            })
        });
    }
}

module.exports = port;
