/**
 * Created by ashenone on 16-10-9.
 */

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const EventEmitter = require('events')

const downloadRepo = require('download-git-repo')

const firekeeperDir = path.join(__dirname, '../template/firekeeper')

/**
 * 检测文件是否存在
 * @param {String} name
 */
function exists(name) {
    const e = new class extends EventEmitter {}
    fs.access(name, fs.constants.F_OK, (err) => {
        if (err) {
            e.emit('error', err)
        }
        else {
            e.emit('success')
        }
        e.emit('done')
    })
    return e
}

/**
 * 创建目录
 * @param {String} name 目录名称
 */
function mkdir(name) {
    const e = new class extends EventEmitter {}
    fs.mkdir(name, (err) => {
        if (err) {
            e.emit('error', err)
        }
        else {
            e.emit('success')
        }
    })
    return e
}

/**
 * 下载模板 firekeeper
 */
function downloadFireKeeper() {
    const e = new class extends EventEmitter {}

    downloadRepo('AshenOne/FireKeeper', firekeeperDir, (err) => {
        if (err) {
            e.emit('error')
        }
        else {
            e.emit('success')
        }
        e.emit('done')
    })

    return e
}

/**
 * 删除模板 firekeeper
 */
function deleteFireKeeper() {
    const e = new class extends EventEmitter {}

    fs.rmdir(firekeeperDir, (err) => {
        if (err) {
            e.emit('error')
        }
        else {
            e.emit('success')
        }
        e.emit('done')
    })

    return e
}

/**
 * 下载 firekeeper 的 node_modules
 */
function installFireKeeperNodeModules() {
    const e = new class extends EventEmitter {}

    spawn(
        'npm',
        ['install', '--registry=https://registry.npm.taobao.org'],
        { env: process.env, stdio: 'inherit', detached: true, cwd: `${firekeeperDir}` }
    ).on('close', (code) => {
        if (code === 0) {
            e.emit('success')
        }
        else {
            e.emit('error')
        }
        e.emit('done')
    })

    return e
}

/**
 * 删除 firekeeper 的 node_modules
 */
function deleteFireKeeperNodeModules() {
    const e = new class extends EventEmitter {}

    fs.rmdir(`${firekeeperDir}/node_modules`, (err) => {
        if (err) {
            e.emit('error', err)
        }
        else {
            e.emit('success')
        }
        e.emit('done')
    })

    return e
}

module.exports = {
    mkdir: mkdir,
    exists: exists,
    downloadFireKeeper: downloadFireKeeper,
    deleteFireKeeper: deleteFireKeeper,
    installFireKeeperNodeModules: installFireKeeperNodeModules,
    deleteFireKeeperNodeModules: deleteFireKeeperNodeModules
}
