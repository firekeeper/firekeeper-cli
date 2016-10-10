/**
 * Created by ashenone on 16-10-9.
 */

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

const copy = require('copy-dir')
const repo = require('download-git-repo')
const rmrf = require('rimraf')
const program = require('commander')

const firekeeperDir = path.join(__dirname, '../template/firekeeper')

program.parse(process.argv)

console.log()

const action = program.args[0]
const project = program.args[1]

function handleCopy() {
    console.log('  开始复制模板文件...\n')
    copy(firekeeperDir, `./${project}`, (err) => {
        if (err) {
            console.log('  模板文件复制失败\n')
        }
        else {
            console.log('  项目创建完成\n')
            console.log(`  cd ${project} && npm run dev\n`)
        }
    })
}

function removeNodeModules() {
    console.log('  开始清理 node_modules...\n')
    rmrf(`${firekeeperDir}/node_modules`, (err) => {
        if (err) {
            console.log(err)
            console.log('  node_modules 清理失败，请执行命令 clean 或手动清理\n')
        }
        else {
            console.log('  node_modules 清理成功\n')
        }
    })
}

function installNodeModules() {
    console.log('  开始安装 node_modules...\n')
    spawn(
        'npm',
        ['install', '--registry=https://registry.npm.taobao.org'],
        { env: process.env, stdio: 'inherit', detached: true, cwd: `${firekeeperDir}` }
    ).on('close', (code) => {
        if (code === 0) {
            console.log('  node_modules 安装成功\n')
            handleCopy()
        }
        else {
            console.log('  node_modules 安装失败\n')
            removeNodeModules()
        }
    })
}

function handleNodeModules() {
    fs.access(`${firekeeperDir}/node_modules`, fs.constants.F_OK, (err) => {
        if (err) {
            installNodeModules()
        }
        else {
            // 开始复制
            handleCopy()
        }
    })
}

function removeRepo() {
    console.log('  正在清理模板文件...\n')
    rmrf(firekeeperDir, (err) => {
        if (err) {
            console.log('  模板文件清理失败，请执行命令 clean 或手动清理\n')
        }
        else {
            console.log('  模板文件清理成功\n')
        }
    })
}

function handleRepo() {
    fs.access(firekeeperDir, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('  开始下载模板...\n')
            repo('firekeeper/firekeeper-template', firekeeperDir, (err) => {
                if (err) {
                    console.log('  模板下载失败\n')
                    removeRepo()
                }
                else {
                    console.log('  模板下载成功\n')
                    handleNodeModules()
                }
            })
        }
        else {
            handleNodeModules()
        }
    })
}

function handlePrject(name) {
    console.log('  开始创建文件夹...\n')
    fs.mkdir(name, (err) => {
        if (err) {
            console.log('  文件夹创建失败\n')
        }
        else {
            console.log('  文件夹创建成功\n')
            handleRepo()
        }
    })
}

function handleActionNew(name) {
    if (name === undefined || name === '') {
        console.log('  项目名不能为空\n')
        return
    }
    fs.access(name, fs.constants.F_OK, (err) => {
        if (err) {
            handlePrject(name)
        }
        else {
            console.log(`  项目 ${name} 已存在\n`)
        }
    })
}

function handleActionUpdate() {
    console.log('  正在清理模板文件...\n')
    rmrf(firekeeperDir, (err) => {
        if (err) {
            console.log('  模板文件清理失败，请执行命令 clean 或手动清理\n')
        }
        else {
            console.log('  模板文件清理成功\n')
            console.log('  开始重新下载模板文件...\n')
            repo('firekeeper/firekeeper-template', firekeeperDir, (err) => {
                if (err) {
                    console.log('  模板文件下载失败\n')
                    removeRepo()
                }
                else {
                    console.log('  模板文件下载成功\n')
                    console.log('  开始安装 node_modules...\n')
                    spawn(
                        'npm',
                        ['install', '--registry=https://registry.npm.taobao.org'],
                        { env: process.env, stdio: 'inherit', detached: true, cwd: `${firekeeperDir}` }
                    ).on('close', (code) => {
                        if (code === 0) {
                            console.log('  更新成功\n')
                        }
                        else {
                            console.log('  node_modules 安装失败\n')
                            removeNodeModules()
                        }
                    })
                }
            })
        }
    })
}

function handleActionClean() {
    removeRepo()
}

if (action === 'new') {
    handleActionNew(project)
}
else if (action === 'update') {
    handleActionUpdate()
}
else if (action === 'clean') {
    handleActionClean()
}
