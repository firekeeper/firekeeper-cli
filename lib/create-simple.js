const fs = require('fs')

const logSymbols = require('log-symbols')

const settings = require('./settings')

module.exports = (mode) => {
    console.log('')
    console.log('  开始创建 simple 目录...')

    fs.mkdir(settings[mode].package.path, (err) => {
        if (err) {
            console.log(logSymbols['error'], '目录创建失败')
        }
        else {
            console.log(logSymbols['success'], '目录创建成功')
        }
    })
}
