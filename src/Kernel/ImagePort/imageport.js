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
    getMaterialImgUrl: ($token) => {

        console.log(`$token:` + $token);

        return new Promise((resolve, reject) => {

            let formData = { media: port.WallpaperPicture() };
            let options = { method: 'POST', url: util.format(config.apiURL.getImgUrl, config.prefix, $token), formData: formData, json: true };

            port.httpRequest(options, 'getMaterialImgUrl').then(data => {

                port.fetchMaterial('image', data.media_id, {}, $token).then(res => {

                    console.log('--------------------')
                    console.log(res)
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });

            }).catch(err => {
                reject(err);
            });

            // port.uploadMaterial('image', port.WallpaperPicture(), {}, $token).then(data => {
            //     console.log(data)
            //     resolve(data);
            // }).catch(err => {
            //     reject(err);
            // });
        });

    },

    /**上传素材的方法 */
    uploadMaterial: (type, material, permanent, token) => {

        return new Promise((resolve, reject) => {

            let formData = { media: material, access_token: token };
            let options = { method: 'POST', url: util.format(config.apiURL.upload, config.prefix, token), formData: formData, json: true };

            port.httpRequest(options, 'uploadMaterial').then(data => {
                console.log(data)
                port.fetchMaterial('image', data.media_id, {}, token).then(res => {

                    console.log(res)
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        })
    },
    /**获取图片 */
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

    /**获取素材的方法 */
    fetchMaterial: (type, mediaId, permanent, token) => {

        return new Promise((resolve, reject) => {
            let from = { media_id: mediaId }

            let options = { method: 'POST', url: util.format(config.apiURL.fetch, config.prefix, token), body: from, json: true };
            console.log(options)
            port.httpRequest(options, 'fetchMaterial').then(data => {
                console.log(data)
                resolve(data)
            }).catch(err => {
                reject(err);
            });

        });
    },

    //http处理函数
    httpRequest: (options, msg) => {
        return new Promise((resolve, reject) => {
            bluebird(options).then(function (response) {
                var _data = response.body
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error(msg + '  error')
                }
            })
                .catch(function (err) {
                    reject(err)
                })
        });
    }
}

module.exports = port;
