const os = require('os')
const path = require('path')
const fs = require('fs')

const chalk = require('chalk')
const request = require('request')
const progress = require('request-progress')
const logUpdate = require('log-update')

const firekeeperDir = path.join(os.homedir(), '.firekeeper')

const source = [
    'https://ogo0r2tnd.qnssl.com',
    'http://firekeeper.oss-cn-shanghai.aliyuncs.com'
]

console.log('')

function downloadPackage(uri, filename, release) {
    let i = 0
    const frames = ['-', '\\', '|', '/']

    let speed = 0.00
    let percentage = 0

    console.log(`  下载：${filename}`)

    progress(request(uri), { throttle: 100 })
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
            logUpdate.clear()
            logUpdate.done()
            console.log(`  downloading：[====================] ${speed}MB/s 100%`)
        })
        .pipe(fs.createWriteStream(release))
}

downloadPackage(`${source[0]}/simple/firekeeper.json?v=${Math.random()}`, 'firekeeper.json', `${firekeeperDir}/simple/firekeeper.json`)

downloadPackage(`${source[0]}/simple/firekeeper-simple-0.0.2.zip?v=${Math.random()}`, 'firekeeper-simple.0.0.2.zip', `${firekeeperDir}/simple/firekeeper-simple.0.0.2.zip`)