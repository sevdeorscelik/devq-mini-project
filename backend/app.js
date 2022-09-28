const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const {DB_URL, DB_PORT, DB_NAME, PORT} = process.env

mongoose.connect(`mongodb://${DB_URL}:${DB_PORT}/${DB_NAME}`)

const app = express()
app.use(express.json())
app.use(cookieParser())

const corsConfig = {
  origin: 'http://localhost:3001',
  credentials: true,
}

app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

app.use('/user', require('./src/routes/user'))
app.use('/answers', require('./src/routes/answers'))
app.use('/questions', require('./src/routes/questions'))

app.post('/drop-database', async (req, res) => {
  await mongoose.connection.db.dropDatabase()
  res.status(200).send('OK')
})


app.use((req, res, next) => {
  const error = new Error('Nichts gefunden')
  error.status = 404
  next(error)
})


// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: error.message
  })
})

app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})