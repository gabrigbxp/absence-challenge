require('dotenv').config()
const express = require("express")
const passport = require("passport")

const db = require("./mongo/config")
const { errorUse } = require('./middlewares/errorHandler')
const initializePassport = require('./middlewares/passport')
const BusinessError = require('./errors/BusinessError')
const apiUserRoutes = require("./api_routes/user")
const apiQuizzRoutes = require("./api_routes/quizz")
const apiTakeQuizzRoutes = require("./api_routes/take-quizz")

console.debug("=====================================")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

initializePassport(passport)

app.use("/api", apiUserRoutes)
app.use("/api", passport.authenticate('jwt'), apiQuizzRoutes)
app.use("/api", passport.authenticate('jwt'), apiTakeQuizzRoutes)

app.use((_req, _res, next) => next(new BusinessError(400, "Endpoint not found")))

app.use(errorUse)

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)

  db(() => console.info("Connected to database"),
    err => console.error("Failed to connect to database", err))
})
