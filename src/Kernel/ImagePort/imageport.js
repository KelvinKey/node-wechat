'use  strict'

const fs = require('fs');
const path = require('path');
const util = require('util');
const request = require('request');
//该操作可以将原本的request方法封装成一个promise函数
const bluebird = require('bluebird').promisify(request);
const config = require(__dirname.split('src')[0] + 'config.json');


const port = {

    //上传图文消息的图片获取URL
    getMaterialImgUrl: ($token) => {

        let formData = { media: port.WallpaperPicture() };
        let options = { method: 'POST', url: util.format(config.apiURL.getImgUrl, config.prefix, $token), formData: formData, json: true };

        port.httpRequest(options, 'getMaterialImgUrl').then(data => {

            return port.uploadMaterial('image', data.url, {}, $token);

        }).catch(err => {
            console.log(err);
        });
    },

    /**上传素材的方法 */
    uploadMaterial: (type, material, permanent, token) => {
        //创建一个from对象
        //var form = {};
        // if (type == 'image' && !permanent) {
        //     //上传类型为图文消息里面的图片
        //     uploadUrl = api.temporary.upload
        //     console.log('11111')
        // }
        // if (type === 'news') {
        //     //上传类型为图文消息,material就是一个article数组
        //     uploadUrl = api.permanent.uploadNews
        //     form = material
        //     console.log('2222')
        // } else {
        //     console.log('3333')
        //     //如果不是图文消息,是图片或者视频的话,那这个就是一个素材路径
        //     form.media = port.WallpaperPicture()

        // }

        //var url = util.format(config.apiURL.upload, config.prefix, token)

        // //判断是否为永久素材
        // if (!permanent) {
        //     url += '&type=' + type
        //     console.log('44444')
        // }
        // else if (permanent && type != 'news') {
        //     console.log('55555')
        //     form.access_token = token
        // }


        // console.log(form)


        // var options = { method: 'POST', url: url, formData: { media: port.WallpaperPicture(), access_token: token }, json: true }

        let formData = { media: port.WallpaperPicture(), access_token: token };

        let options = { method: 'POST', url: util.format(config.apiURL.upload, config.prefix, token), formData: formData, json: true };

        // //当上传素材为图文的时候,我们请求上传的就不是form,而是body
        // if (type === 'news') {
        //     console.log('66666')
        //     options.body = form
        // } else {
        //     console.log('77777')
        //     options.formData = form
        // }

        // console.log(form)

        // console.log(options)

        port.httpRequest(options, 'uploadMaterial').then(data => {
            console.log(data.body)
        }).catch(err => {
            console.log(err);
        });
    },
    /**获取图片 */
    WallpaperPicture: () => {
        bluebird({ url: config.bing, json: true }).then(data => {

            let readStream = request(data.body.data.url);
            let writeStream = fs.createWriteStream('./img/image.jpg');
            readStream.pipe(writeStream);

        }).catch(err => {

            console.log(err);
        });

        return fs.createReadStream(path.join(__dirname, './img/image.jpg'));
    },

    //http处理函数
    httpRequest: (options, msg) => {
        return new Promise((resolve, reject) => {
            bluebird(options).then(response => {
                if (response.body) {
                    resolve(response.body)
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


//port.getMaterialImgUrl();