const fs = require('fs')

const request = require('request')
const progress = require('request-progress')
const logUpdate = require('log-update')
const logSymbols = require('log-symbols')
const chalk = require('chalk')

const settings = require('./settings')

module.exports = (mode) => {
    console.log()
    console.log('  开始下载校验文件：')

    const frames = ['-', '\\', '|', '/']

    let i = 0, speed = 0, percentage = 0

    progress(request(`${settings.source[0]}/${settings[mode].verifyFile.remote}?v=${Math.random()}`), { throttle: 100 })
        .on('progress', function (state) {
            const frame = frames[i++ % frames.length]

            speed = (state.speed/1024/1024).toFixed(2)
            percentage = (state.percentage*100).toFixed(2)

            const progressBar = (function() {
                const width = 20
                const completed = Math.ceil(width * state.percentage)
                const loading = width - completed
                return new Array(completed + 1).join('=') + new Array(loading + 1).join('-')
            })()

            logUpdate(`${chalk['cyan'](frame)} downloading：[${progressBar}] ${speed}MB/s ${percentage}%`)
        })
        .on('error', function() {

        })
        .on('end', function() {
            logUpdate(`${logSymbols['success']} downloading：[====================] ${speed}MB/s 100%`)
            logUpdate.done()
        })
        .pipe(fs.createWriteStream(settings[mode].verifyFile.local))
}