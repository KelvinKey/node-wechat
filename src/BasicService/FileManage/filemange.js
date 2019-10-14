'use strict'

const fs = require('fs');

const file = {
    //异步读取文件
    readFileAsync: fpath => {
        return new Promise(function (resolve, reject) {
            fs.readFile(fpath, (err, data) => {
                err ? reject(err) : resolve(data.toString());
            })
        })
    },
    //异步写入文件
    writeFileAsync: (fpath, content) => {
        return new Promise(function (resolve, reject) {
            fs.writeFile(fpath, content, (err) => {
                err ? reject(err) : resolve(content);
            })
        })
    }
}

module.exports = file;