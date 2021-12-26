const Quizz = require("../models/quizz")
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

module.exports = { create, get }
