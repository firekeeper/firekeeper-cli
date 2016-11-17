const os = require('os')

module.exports = {
    source: [
        'https://ogo0r2tnd.qnssl.com',
        'http://firekeeper.oss-cn-shanghai.aliyuncs.com'
    ],
    package: {
        path: `${os.homedir()}/.firekeeper`
    },
    simple: {
        verifyFile: {
            local: `${os.homedir()}/.firekeeper/simple/firekeeper.json`,
            remote: `/simple/firekeeper.json`
        },
        package: {
            path: `${os.homedir()}/.firekeeper/simple`
        }
    }
}