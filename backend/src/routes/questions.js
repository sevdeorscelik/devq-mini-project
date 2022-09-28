const express = require('express')
const controller = require('../conrollers/questions')
const validations = require('../lib/validators/questions')
const auth = require('../lib/middlewares/auth')
require('express-async-errors')

const app = express.Router()

// -> /questions
app.route('/')
.get(controller.getQuestionList)
.post(auth, validations.createQuestion, controller.createQuestion)

// -> /6314611e32bfaa1ece32d0f3
app.get('/:id', controller.getQuestionsById)

module.exports = app