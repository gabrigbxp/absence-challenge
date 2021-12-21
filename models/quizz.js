const { Schema, model } = require("mongoose")
const BusinessError = require("../errors/BusinessError")
const AnswerSchema = require("./answer")

const QuizzSchema = new Schema({
  title: String,
  user: Number,
  questions: [{
    title: String,
    multipleChoice: Boolean,
    answers: [AnswerSchema]
  }],
})

QuizzSchema.pre("validate", function (next) {
  if (!this.questions.length) return next(new BusinessError(400, "Quizz need at least 1 question"))

  next()
})

module.exports = model("quizz", QuizzSchema)
