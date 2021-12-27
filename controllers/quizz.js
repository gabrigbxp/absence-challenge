const Quizz = require("../models/quizz")
const BusinessError = require("../errors/BusinessError")

const create = async (req, res, next) => {
  const quizz = new Quizz({ ...req.body, user: req.user._id })

  quizz.save(err => {
    if (err) return next(err.code === 11000 ? new BusinessError(500, "Quizz already exists") : err)
    res.status(200).json(quizz)
  })
}

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

module.exports = { create, get }
