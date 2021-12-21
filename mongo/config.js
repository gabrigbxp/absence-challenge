const mongoose = require("mongoose")

const initDB = (callback, onError) => {
  const uri = "mongodb+srv://absence:jzhMGzTiwzBsUkgC@cluster0.v8lzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  mongoose.connect(uri)

  const db = mongoose.connection

  db.on('error', err => {
    onError?.(err)
  })

  db.once('open', () => {
    callback?.()
  })
}

module.exports = initDB