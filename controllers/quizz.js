const Quizz = require("../models/quizz")
const BusinessError = require("../errors/BusinessError")

const create = async (req, res, next) => {
  const quizz = new Quizz(req.body)

  quizz.save(err => {
    if (err) return next(err.code === 11000 ? new BusinessError(500, "Quizz already exists") : err)
    res.status(200).json(quizz)
  })
}

const login = async (username, password, done) => {
  const e404 = new BusinessError(404, "Wrong user or password")
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

const findUserByToken = async (token, done) => {
  const e404 = new BusinessError(404, "Wrong user or password")
  User.findOne({ token }, (err, user) => {
    if (err) return done(err, false)

    done(null, user ?? false)
  })
}

module.exports = { create, login, findUserByToken }
