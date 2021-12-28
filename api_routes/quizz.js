const router = require("express").Router()

const { create: createQuizz, put: updateQuizz, get: getQuizz, } = require("../controllers/quizz")
const { errorHandler } = require('../middlewares/errorHandler')

router.get("/quizz/:id?", errorHandler(getQuizz))
router.post("/quizz", errorHandler(createQuizz))
router.put("/quizz/:id", errorHandler(updateQuizz))

module.exports = router
