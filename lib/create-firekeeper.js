const fs = require('fs')

const logSymbols = require('log-symbols')

const settings = require('./settings')

module.exports = () => {
    console.log('')
    console.log('  开始创建 firekeeper 目录...')

    fs.mkdir(settings.package.path, (err) => {
        if (err) {
            console.log(logSymbols['error'], '目录创建失败')
        }
        else {
            console.log(logSymbols['success'], '目录创建成功')
        }
    })
}