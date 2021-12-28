const { Schema, model } = require("mongoose")

const AnswerSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  score: {type: Number, default: 0}
})

module.exports = AnswerSchema
