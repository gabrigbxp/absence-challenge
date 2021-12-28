require('dotenv').config()
const jwt = require('jsonwebtoken')
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

const login = async (req, res, next) => {
  const { username, password } = req.body
  User.findOne({ username }, (err, user) => {
    if (err) return next(err)

    !user ? next(e404) : user.comparePassword(password, (err, isMatch) => {
      if (err) return next(err)

      if (isMatch) {
        const payload = { id: user._id, username }
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        user.save(err => err ? next(err) : res.status(200).json({ token }))
      } else {
        next(e404)
      }
    })
  })
}

const passportUserFound = done => (err, user) => done(err, user ? { _id: user._id, username: user.username } : false)

const strategyLogin = async (jwt_payload, done) => User.findOne({ _id: jwt_payload.id, username: jwt_payload.username }, passportUserFound(done)).catch(e => { })

const findById = async (id, done) => User.findOne({ _id: id }, passportUserFound(done)).catch(e => { })

module.exports = { get, create, put, login, strategyLogin, findById }
