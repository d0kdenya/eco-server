const path = require('path')
const fs = require("fs")

module.exports = function deleteFiles(filesArray, directPath) {
  if (filesArray === null || filesArray === undefined) {
    return 0
  }

  if (typeof (filesArray) === 'string') {
    fs.unlink(path.resolve(`${directPath}/${filesArray}`), (err) => {
      if (err) console.log(err);
      else console.log(`${filesArray} was deleted`)
    })
    return 1
  }

  if (!filesArray.length) {
    return 0
  }

  filesArray.forEach(file => {
    fs.unlink(path.resolve(`${directPath}/${file}`), (err) => {
      if (err) console.log(err);
      else console.log(`${file} was deleted`)
    })
  })
  return 1
}