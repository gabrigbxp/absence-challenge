require('dotenv').config();
const jwt = require('jsonwebtoken')
const User = require("../models/users")
const BusinessError = require("../errors/BusinessError")
const encrypt = require("../utils/encrypt")

const get = async (req, res) => {
  res.status(200).json({ _id: req.user._id, username: req.user.username })
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
        const payload = { id: user._id, username };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        user.token = token
        user.save(err => err ? next(err) : res.status(200).json({ token }))
      } else {
        next(e404)
      }
    })
  })
}

const strategyLogin = async (jwt_payload, done) => {
  User.findOne({ _id: jwt_payload.id, username: jwt_payload.username }, (err, user) => {
    done(err, user ?? false)
  })
}

const findByToken = async (token, done) => {
  User.findOne({ token }, (err, user) => {
    if (err) return done(err, false)

    done(null, user ?? false)
  })
}

module.exports = { get, create, put, login, strategyLogin, findByToken }
