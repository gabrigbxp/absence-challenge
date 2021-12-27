const bcrypt = require("bcrypt")
const SALT_WORK_FACTOR = 10

const encrypt = (e, next) => bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
  if (err) return next(err)

  bcrypt.hash(e.password, salt, (err, hash) => {
    if (err) return next(err)
    e.password = hash
    next()
  })
})

module.exports = encrypt
