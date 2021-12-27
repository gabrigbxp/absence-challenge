const express = require("express")
const db = require("./mongo/config")
const { create: createUser } = require("./controllers/users")
const { create: createQuizz, get: getQuizz, take: takeQuizz } = require("./controllers/quizz")
const { errorHandler, errorUse } = require('./middlewares/errorHandler')
const { initializePassport, ensureAuthenticated } = require('./middlewares/passport')
const passport = require("passport")
const cookieParser = require("cookie-parser")
const session = require("express-session")

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

app.post("/user", errorHandler(createUser))
app.post("/login", passport.authenticate("local"), (req, res) => res.status(200).json(req.user.token))

app.post("/quizz", ensureAuthenticated, errorHandler(createQuizz))
app.get("/quizz/:id?", ensureAuthenticated, errorHandler(getQuizz))

app.post("/take-quizz", ensureAuthenticated, errorHandler(takeQuizz))

app.use(errorUse)

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000")

  db(() => console.info("Connected to database"),
    err => console.error("Failed to connect to database", err))
})
