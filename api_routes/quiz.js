const router = require("express").Router()

const { create: createQuiz, put: updateQuiz, get: getQuiz, } = require("../controllers/quiz")
const { errorHandler } = require('../middlewares/errorHandler')

router.get("/quiz/:id?", errorHandler(getQuiz))
router.post("/quiz", errorHandler(createQuiz))
router.put("/quiz/:id", errorHandler(updateQuiz))

module.exports = router
