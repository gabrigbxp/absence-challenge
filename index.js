import express from "express"

const app = express()

// app.use(express.urlencoded({ extended: true }))

app.listen(8000, (req, res) => {
  console.clear()
  console.log("Server running at http://localhost:8000")
}) 