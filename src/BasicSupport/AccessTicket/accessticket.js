'use strict'

const _file = require(__dirname.split('src')[0] + 'src/BasicService/FileManage/filemange.js');
const config = require(__dirname.split('src')[0] + 'config.json');

const util = require('util');
const bluebird = require('bluebird');
const request = bluebird.promisify(require('request'));

const ticket = {

    /**get fetch ticket */
    fetchTicket: ($params) => {
        return new Promise((resolve, reject) => {
            (_file.readFileAsync(__dirname + '/ticket.txt')).then(data => {
                try {
                    data = JSON.parse(data);//有效token
                } catch (err) {
                    return ticket.upTicket($params);
                }
                return ticket.isValidTicket(data) ? resolve(data) : ticket.upTicket($params);
            }).then(data => {
                _file.writeFileAsync(__dirname + '/ticket.txt', JSON.stringify(data));
                resolve(data);
            }).catch(err => {
                reject(err);
                console.log(err);
            });
        })
    },

    /**up ticket */
    upTicket: ($params) => {
        let $url = util.format(config.apiURL.ticket, config.prefix, $params);
        return new Promise((resolve, reject) => {
            request({ url: $url, json: true }).then(response => {
                let data = response.body;
                data.expires_in = (new Date().getTime()) + (data.expires_in - 20) * 1000;
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        })

    },

    /**verify tickrt */
    isValidTicket: ($prarms) => {
        !$prarms || !$prarms.ticket || !$prarms.expires_in ? false : true;
        //当前时间小于有效期即为有效
        return ($prarms.ticket && new Date().getTime() < $prarms.expires_in) ? true : false;
    },

}

module.exports = ticket;