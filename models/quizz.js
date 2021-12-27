const { Schema, model } = require("mongoose")
const BusinessError = require("../errors/BusinessError")
const AnswerSchema = require("./answer")

const QuizzSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  questions: [{
    title: { type: String, required: true },
    multipleChoice: { type: Boolean, required: true },
    answers: [AnswerSchema]
  }],
})

QuizzSchema.pre("validate", function (next) {
  if (!this.questions.length) return next(new BusinessError(400, "Quizz need at least 1 question"))

  for (let question of this.questions) {
    let oneTrue = false, oneFalse = false

    if (!question.answers) return next(new BusinessError(400, "Answers need at least 1 option"))

    for (let answer of question.answers) {
      answer.isCorrect ? (oneTrue = true) : (oneFalse = true)
      if (oneTrue && oneFalse) break
    }

    if (!oneTrue || !oneFalse) return next(new BusinessError(400, "Answers need at least 1 correct option and 1 incorrect option"))
  }

  next()
})

module.exports = model("quizz", QuizzSchema)
