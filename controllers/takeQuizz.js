const TakeQuizz = require("../models/takeQuizz")
const Quizz = require("../models/quizz")
const BusinessError = require("../errors/BusinessError")

const create = async (req, res, next) => {
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

const get = async (req, res, next) => {
  const takeQuizz = await TakeQuizz.find({ user: req.user._id })

  if (!takeQuizz.length) return next(new BusinessError(404, "No quizz taken by current user"))

  const quizzes = {}

  for (let take of takeQuizz) {
    const quizzId = take.quizz

    if (!quizzes[quizzId]) {
      const quizz = await Quizz.findOne({ _id: quizzId })
      quizzes[quizzId] = { title: quizz.title, scores: [], attempts: 0 }
    }

    quizzes[quizzId].scores.push(take.score)
    quizzes[quizzId].attempts++
  }

  res.status(200).json(Object.keys(quizzes).map(index => quizzes[index]))
}

module.exports = { create, get }
