const chalk = require('chalk')
const StreamZip = require('node-stream-zip')
const logUpdate = require('log-update')
const logSymbols = require('log-symbols')

const settings = require('./settings')

module.exports = (mode) => {
    const firekeeper = require(settings[mode].verifyFile.local)

    const frames = ['-', '\\', '|', '/']
    let i = 0,
        counts = 0,
        entriesCount = 0,
        width = 0,
        completed = 0,
        loading = 0,
        progressBar = ''

    const zip = new StreamZip({
        file: `${settings[mode].package.path}/${firekeeper['least'].filename}`,
        storeEntries: true
    })

    zip['on']('error', err => {
        console.log(err)
    })

    zip['on']('ready', () => {
        console.log('')
        console.log('  开始解压文件...')

        zip.extract(null, './dist/', () => {
            logUpdate(`${logSymbols['success']} [${progressBar}] ${counts}/${entriesCount}`)
            logUpdate['done']()
        })
    })

    zip['on']('extract', () => {
        counts += 1
        const frame = frames[i++ % frames.length]

        width = 20,
        completed = parseInt(width * (counts / entriesCount)),
        loading = width - completed,
        progressBar = new Array(completed + 1).join('=') + new Array(loading + 1).join('-')

        logUpdate(`${chalk['cyan'](frame)} [${progressBar}] ${counts}/${entriesCount}`)
    })

    zip['on']('entry', (entry) => {
        if (!entry.isDirectory) entriesCount++
    })
}
