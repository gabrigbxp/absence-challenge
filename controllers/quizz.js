const Quizz = require("../models/quizz")
const TakeQuizz = require("../models/takeQuizz")
const BusinessError = require("../errors/BusinessError")

const create = async (req, res, next) => {
  const quizz = new Quizz({ ...req.body, user: req.user._id })

  quizz.save(err => {
    if (err) return next(err.code === 11000 ? new BusinessError(500, "Quizz already exists") : err)
    res.status(200).json(quizz)
  })
}

const get = async (req, res) => {
  const { id } = req.params
  const find = {}
  id && (find._id = id)
  const quizz = await Quizz[id ? "findOne" : "find"](find)
  res.status(quizz ? 200 : 404).json(quizz ?? {})
}

const take = async (req, res, next) => {
  const quizz = await Quizz.findOne({ _id: req.body.quizz })

  if (!quizz) return next(new BusinessError(404, "Quizz not found"))

  let score = 0
  for (let question of req.body.questions) {
    const auxQuestion = quizz.questions.id(question.id)

    if (!auxQuestion) return next(new BusinessError(404, "Question not found"))

    for (let answer of question.answers) {
      const auxAnswer = auxQuestion.answers.id(answer)

      if (!auxAnswer) return next(new BusinessError(404, `Answer with id "${answer}" not found`))

      score += auxAnswer.isCorrect ? auxAnswer.score : 0
    }
  }

  const takeQuizz = new TakeQuizz({ ...req.body, user: req.user._id, score })
  takeQuizz.save(err => {
    if (err) return next(err)
    res.status(200).json(takeQuizz)
  })
}

module.exports = { create, get, take }
