const {body} = require('express-validator')
const validator = require('../middlewares/validator')

exports.createAnswer = [
    body('description').exists().withMessage('Wir brauchen deine Antwort'),
    body('question').exists().withMessage('Wir kennen die Frage nicht'),
    validator
]

