const TakeQuiz = require("../models/quizAttempt")
const Quiz = require("../models/quiz")
const BusinessError = require("../errors/BusinessError")

const create = async (req, res, next) => {
  const quiz = await Quiz.findOne({ _id: req.body.quiz })

  if (!quiz) return next(new BusinessError(404, "Quiz not found"))

  let score = 0
  for (let question of req.body.questions) {
    const auxQuestion = quiz.questions.id(question.id)

    if (!auxQuestion) return next(new BusinessError(404, "Question not found"))

    let allCorrect = true

    for (let answer of question.answers) {
      const auxAnswer = auxQuestion.answers.id(answer)

      if (!auxAnswer) return next(new BusinessError(404, `Answer with id "${answer}" not found`))

      !auxAnswer.isCorrect && (allCorrect = false)
      score += auxAnswer.isCorrect ? auxAnswer.score : 0
    }

    allCorrect && (score += auxQuestion.score)
  }

  const takeQuiz = new TakeQuiz({ ...req.body, user: req.user._id, score })
  takeQuiz.save(err => {
    if (err) return next(err)
    res.status(200).json(takeQuiz)
  })
}

const get = async (req, res, next) => {
  const takeQuiz = await TakeQuiz.find({ user: req.user._id })

  if (!takeQuiz.length) return next(new BusinessError(404, "No quiz taken by current user"))

  const quizes = {}

  for (let take of takeQuiz) {
    const quizId = take.quiz

    if (!quizes[quizId]) {
      const quiz = await Quiz.findOne({ _id: quizId })
      let maxScore = 0

      for (let questions of quiz.questions) {
        maxScore += questions.score
        for (let answer of questions.answers) {
          maxScore += answer.score
        }
      }

      quizes[quizId] = { title: quiz.title, maxScore, scores: [] }
    }

    quizes[quizId].scores.push(take.score)
  }

  res.status(200).json(Object.keys(quizes).map(index => quizes[index]))
}

module.exports = { create, get }
