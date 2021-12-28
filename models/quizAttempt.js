const { Schema, model } = require("mongoose")
const BusinessError = require("../errors/BusinessError")

const QuizAttemptSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'quiz', required: true },
  questions: [{
    id: { type: Schema.Types.ObjectId, ref: 'question', required: true },
    answers: [{ type: Schema.Types.ObjectId, ref: 'answer', required: true }],
  }],
  score: Number
})

QuizAttemptSchema.pre("validate", function (next) {
  if (!this.questions.length) return next(new BusinessError(400, "TakeQuiz need at least 1 question"))

  for (let question of this.questions) {
    if (!question.answers.length) return next(new BusinessError(400, "TakeQuiz need at least 1 answer per question"))
  }

  next()
})

module.exports = model("takeQuiz", QuizAttemptSchema)
