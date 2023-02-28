const multer = require('multer')
const moment = require('moment')
const uuid = require('uuid')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    const id = uuid.v4()
    const format = file.originalname.split('.')
    cb(null, `${date}-${id}.${format[format.length - 1]}`)
  }
})


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'
    || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/msword'
    || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    || file.mimetype === 'application/vnd.oasis.opendocument.text'
    || file.mimetype === 'image/gif' || file.mimetype === 'image/pjpeg'
    || file.mimetype === 'image/svg+xml' || file.mimetype === 'image/tiff'
    || file.mimetype === 'image/vnd.microsoft.icon' || file.mimetype === 'image/vnd.wap.wbmp' || file.mimetype === 'image/webp') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 25
}

module.exports = multer({
  storage,
  fileFilter,
  limits
})