const router = require("express").Router()

const { create: createTakeQuiz, get: getTakeQuiz } = require("../controllers/quizAttempt")
const { errorHandler } = require('../middlewares/errorHandler')

router.post("/quiz-attempt", errorHandler(createTakeQuiz))
router.get("/quiz-attempt", errorHandler(getTakeQuiz))

module.exports = router
