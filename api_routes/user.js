const router = require("express").Router()
const passport = require("passport")

const { get: getUser, create: createUser, login: loginUser, put: updateUser } = require("../controllers/users")
const { errorHandler } = require('../middlewares/errorHandler')

router.get("/user", passport.authenticate('jwt'), errorHandler(getUser))
router.post("/user", errorHandler(createUser))
router.put("/user", passport.authenticate('jwt'), errorHandler(updateUser))

router.post("/login", errorHandler(loginUser))

module.exports = router
