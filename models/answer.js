const { Schema, model } = require("mongoose")

const AnswerSchema = new Schema({
  text: String,
  isCorrect: Boolean
})

module.exports = AnswerSchema
