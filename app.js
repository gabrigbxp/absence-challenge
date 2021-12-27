const express = require("express")
const db = require("./mongo/config")
const passport = require("passport")

const { get: getUser, create: createUser, login: loginUser, put: updateUser } = require("./controllers/users")
const { create: createQuizz, put: updateQuizz, get: getQuizz, } = require("./controllers/quizz")
const { create: createTakeQuizz, get: getTakeQuizz } = require("./controllers/takeQuizz")
const { errorHandler, errorUse } = require('./middlewares/errorHandler')
const initializePassport = require('./middlewares/passport')

console.debug("=====================================")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

initializePassport(passport)

app.get("/user", passport.authenticate('jwt'), errorHandler(getUser))
app.post("/user", errorHandler(createUser))
app.put("/user", passport.authenticate('jwt'), errorHandler(updateUser))
app.post("/login", errorHandler(loginUser))

app.get("/quizz/:id?", passport.authenticate('jwt'), errorHandler(getQuizz))
app.post("/quizz", passport.authenticate('jwt'), errorHandler(createQuizz))
app.put("/quizz/:id", passport.authenticate('jwt'), errorHandler(updateQuizz))

app.post("/take-quizz", passport.authenticate('jwt'), errorHandler(createTakeQuizz))
app.get("/take-quizz", passport.authenticate('jwt'), errorHandler(getTakeQuizz))

app.use(errorUse)

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000")

  db(() => console.info("Connected to database"),
    err => console.error("Failed to connect to database", err))
})
