const fs = require('fs')
const os = require('os')
const path = require('path')

const settings = require('./settings')

const request = require('request')
const progress = require('request-progress')

module.exports = (mode) => {

    console.log('')

    fs.access(settings[mode].verifyFile.local, (err) => {
        if (err) {
            console.log(  '  校验不存在，需要重新下载')
        }
        else {
            const local = require(settings[mode].verifyFile.local)
            request(`${settings.source[0]}${settings[mode].verifyFile.remote}?v=${Math.random()}`, (err, response, body) => {
                try {
                    body = JSON.parse(body)
                }
                catch(err)  {
                    console.log('  线上文件有误，请联系：x@kassading.com')
                    return
                }
                if (local.version === body.version) {
                    console.log('  没有更新')
                }
                else {
                    console.log(`  需要更新\n  本地版本：${local.version}\n  线上版本：${body.version}`)
                }
            })
        }
    })
}