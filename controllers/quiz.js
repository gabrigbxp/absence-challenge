const Quiz = require("../models/quiz")
const BusinessError = require("../errors/BusinessError")

const get = async (req, res, next) => {
  const { id } = req.params
  let quiz

  if (id) {
    quiz = await Quiz.findOne({ _id: id })
  } else {
    quiz = await Quiz.find({})
    !quiz.length && (quiz = null)
  }

  if (!quiz) return next(new BusinessError(404, "Quiz not found"))

  res.status(quiz ? 200 : 404).json(quiz ?? {})
}

const create = async (req, res, next) => {
  const quiz = new Quiz({ ...req.body, user: req.user._id })

  quiz.save(err => {
    if (err) return next(err)
    res.status(200).json(quiz)
  })
}

const put = async (req, res, next) => {
  const { id: _id } = req.params

  if (!_id) return next(new BusinessError(400, "id is required"))

  if (!Object.keys(req.body).length) return next(new BusinessError(400, "JSON body cannot be empty"))

  let quiz = await Quiz.findOne({ _id, user: req.user._id })

  if (!quiz) return next(new BusinessError(404, "Quiz not found"))

  const updateStatus = await Quiz.updateOne({ _id }, req.body)

  if (!updateStatus.acknowledged) return next(new BusinessError(500, "Something went wrong while updating "))

  quiz = await Quiz.findOne({ _id, user: req.user._id })

  res.status(200).json(quiz)
}

module.exports = { get, create, put }
