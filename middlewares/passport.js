require('dotenv').config();
const { errorHandler } = require('./errorHandler')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { strategyLogin, findByToken: findUserByToken } = require("../controllers/users")

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

const initializePassport = passport => {
  passport.use(new JwtStrategy(opts, errorHandler(strategyLogin)))

  passport.serializeUser((user, done) => {
    done(null, user.token)
  })

  passport.deserializeUser(findUserByToken)
}

module.exports = initializePassport
