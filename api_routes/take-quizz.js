const router = require("express").Router()

const { create: createTakeQuizz, get: getTakeQuizz } = require("../controllers/takeQuizz")
const { errorHandler } = require('../middlewares/errorHandler')

router.post("/take-quizz", errorHandler(createTakeQuizz))
router.get("/take-quizz", errorHandler(getTakeQuizz))

module.exports = router
