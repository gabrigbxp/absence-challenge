const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const encrypt = require("../utils/encrypt")

const UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  token: String,
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  encrypt(this, next)
})

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    callback(err, isMatch)
  })
}

module.exports = model("user", UserSchema)
