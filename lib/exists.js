const fs = require('fs')

module.exports = (path, callback) => {
    fs.access(path, (err) => {
        callback(!err)
    })
}