const express = require("express")
const db = require("./mongo/config")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const { get: getUser, create: createUser, put: updateUser } = require("./controllers/users")
const { create: createQuizz, put: updateQuizz, get: getQuizz, } = require("./controllers/quizz")
const { create: createTakeQuizz, get: getTakeQuizz } = require("./controllers/takeQuizz")
const { errorHandler, errorUse } = require('./middlewares/errorHandler')
const { initializePassport, ensureAuthenticated } = require('./middlewares/passport')

console.debug("=====================================")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(
  session({
    secret: 'absence_secret',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  })
)

app.use(passport.initialize())
app.use(passport.session())

initializePassport(passport)

app.get("/user", ensureAuthenticated, errorHandler(getUser))
app.post("/user", errorHandler(createUser))
app.put("/user", ensureAuthenticated, errorHandler(updateUser))
app.post("/login", passport.authenticate("local"), (req, res) => res.status(200).json(req.user.token))

app.get("/quizz/:id?", ensureAuthenticated, errorHandler(getQuizz))
app.post("/quizz", ensureAuthenticated, errorHandler(createQuizz))
app.put("/quizz/:id", ensureAuthenticated, errorHandler(updateQuizz))

app.post("/take-quizz", ensureAuthenticated, errorHandler(createTakeQuizz))
app.get("/take-quizz", ensureAuthenticated, errorHandler(getTakeQuizz))

app.use(errorUse)

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000")

  db(() => console.info("Connected to database"),
    err => console.error("Failed to connect to database", err))
})
