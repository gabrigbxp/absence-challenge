const router = require("express").Router()

const { create: createQuizAttempt, get: getQuizAttempt } = require("../controllers/quizAttempt")
const { errorHandler } = require('../middlewares/errorHandler')

router.post("/quiz-attempt", errorHandler(createQuizAttempt))
router.get("/quiz-attempt", errorHandler(getQuizAttempt))

module.exports = router
