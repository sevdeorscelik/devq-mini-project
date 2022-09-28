const {body} = require('express-validator')
const validator = require('../middlewares/validator')

exports.register = [
    body('email').isEmail().withMessage('wir benötigen eine valide email'),
    body('password').isLength({min: 4}).withMessage('Dein Passwort ist nicht stark genug'),
    body('name').exists().trim().withMessage('Dein Name darf nicht leer sein'),
    validator
]

exports.update = [
    body('name').exists().trim().withMessage('Dein Name darf nicht leer sein'),
    validator
  ]

exports.login = [
    body('email').isEmail().withMessage('wir benötigen eine valide email'),
    body('password').isLength({min: 4}).withMessage('das ist nicht dein Passwort'),
    validator
]