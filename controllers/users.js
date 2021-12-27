const User = require("../models/users")
const BusinessError = require("../errors/BusinessError")
const encrypt = require("../utils/encrypt")

const get = async (req, res) => {
  res.status(200).json(req.user)
}

const create = async (req, res, next) => {
  const { username, password } = req.body

  const user = new User({
    username,
    password
  })

  user.save(err => {
    if (err) return next(err.code === 11000 ? new BusinessError(400, "User already exists") : err)
    res.status(200).json({})
  })
}

const put = async (req, res, next) => {
  new Promise((resolve, _) => {
    req.body.password && encrypt(req.body, resolve)
  })
    .then(async value => {
      if (value) return next(value)

      const updateStatus = await User.updateOne({ _id: req.user._id }, req.body)
      if (!updateStatus.acknowledged) return next(new BusinessError(500, "Something went wrong while updating "))

      res.status(200).json({})
    })
}

const login = async (username, password, done) => {
  const e404 = new BusinessError(400, "Wrong user or password")
  User.findOne({ username }, (err, user) => {
    if (err) return done(err, false)

    !user ? done(e404, false) : user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err, false)

      if (isMatch) {
        user.token = "ThisIsTokenWithExpirationDate"
        user.save(err => done(err, user ?? false))
      } else done(e404, false)
    })
  })
}

const findByToken = async (token, done) => {
  User.findOne({ token }, (err, user) => {
    if (err) return done(err, false)

    done(null, user ? { _id: user._id, username: user.username, token: user.token } : false)
  })
}

module.exports = { get, create, put, login, findByToken }
