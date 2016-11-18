const fs = require('fs')

module.exports = (dirname, callback) => {
    fs.mkdir(dirname, (err) => {
        callback(err)
    })
}
