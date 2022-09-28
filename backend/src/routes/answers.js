const express = require('express')
const controller = require('../conrollers/answers')
const validations = require('../lib/validators/answers')
const auth = require('../lib/middlewares/auth')
require('express-async-errors')

const app = express.Router()

// -> /answers
app.post('/',auth, validations.createAnswer, controller.createAnswer)

module.exports = app