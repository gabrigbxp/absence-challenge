const QuizAttempt = require("../models/quizAttempt")
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

  const quizAttempt = new QuizAttempt({ ...req.body, user: req.user._id, score })
  quizAttempt.save(err => {
    if (err) return next(err)
    res.status(200).json(quizAttempt)
  })
}

const get = async (req, res, next) => {
  const quizAttempt = await QuizAttempt.find({ user: req.user._id })

  if (!quizAttempt.length) return next(new BusinessError(404, "No quiz attempted by current user"))

  const quizzes = {}

  for (let attempt of quizAttempt) {
    const quizId = attempt.quiz

    if (!quizzes[quizId]) {
      const quiz = await Quiz.findOne({ _id: quizId })
      let maxScore = 0

      for (let questions of quiz.questions) {
        maxScore += questions.score
        for (let answer of questions.answers) {
          maxScore += answer.score
        }
      }

      quizzes[quizId] = { title: quiz.title, maxScore, scores: [] }
    }

    quizzes[quizId].scores.push(attempt.score)
  }

  res.status(200).json(Object.keys(quizzes).map(index => quizzes[index]))
}

module.exports = { create, get }
