const { errorHandler } = require('./errorHandler')
const Strategy = require("passport-local")
const { login, findByToken: findUserByToken } = require("../controllers/users")
const AuthenticationError = require('../errors/AuthenticationError')

const initializePassport = passport => {
  passport.use(new Strategy(errorHandler(login)))

  passport.serializeUser((user, done) => {
    done(null, user.token)
  })

  passport.deserializeUser(findUserByToken)
}

const ensureAuthenticated = (req, _res, done) => {
  if (req.isAuthenticated()) return done()
  else done(new AuthenticationError("No session"))
}

module.exports = { initializePassport, ensureAuthenticated }
