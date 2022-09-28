const express = require('express')
const controller = require('../conrollers/user')
const validations = require('../lib/validators/user')
require('express-async-errors')
const multer = require("multer");
const app = express.Router()
const auth = require('../lib/middlewares/auth')

const upload = multer({dest: "uploads/"});

// -> /user
app.get('/', controller.getCurrentUser)

app.patch('/', auth, upload.single("file"), validations.update, controller.updateUser)

// -> /user/logout
app.post('/logout', auth, controller.logout)

// -> /user/register
app.post('/register', upload.single("file"), validations.register, controller.register)

// -> /user/login
app.post('/login', validations.login, controller.login)


module.exports = app