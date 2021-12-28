require('dotenv').config()
const { errorHandler } = require('./errorHandler')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { strategyLogin, findById: findUserById } = require("../controllers/users")

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

const initializePassport = passport => {
  passport.use(new JwtStrategy(opts, strategyLogin))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(findUserById)
}

module.exports = initializePassport
