const Quizz = require("../models/quizz")
const BusinessError = require("../errors/BusinessError")

const get = async (req, res, next) => {
  const { id } = req.params
  let quizz

  if (id) {
    quizz = await Quizz.findOne({ _id: id })
  } else {
    quizz = await Quizz.find({})
    !quizz.length && (quizz = null)
  }

  if (!quizz) return next(new BusinessError(404, "Quizz not found"))

  res.status(quizz ? 200 : 404).json(quizz ?? {})
}

const create = async (req, res, next) => {
  const quizz = new Quizz({ ...req.body, user: req.user._id })

  quizz.save(err => {
    if (err) return next(err)
    res.status(200).json(quizz)
  })
}

const put = async (req, res, next) => {
  const { id: _id } = req.params

  if (!_id) return next(new BusinessError(400, "id is required"))

  if (!Object.keys(req.body).length) return next(new BusinessError(400, "JSON body cannot be empty"))

  let quizz = await Quizz.findOne({ _id, user: req.user._id })

  if (!quizz) return next(new BusinessError(404, "Quizz not found"))

  const updateStatus = await Quizz.updateOne({ _id }, req.body)

  if (!updateStatus.acknowledged) return next(new BusinessError(500, "Something went wrong while updating "))

  quizz = await Quizz.findOne({ _id, user: req.user._id })

  res.status(200).json(quizz)
}

module.exports = { get, create, put }
