const {body} = require('express-validator')
const validator = require('../middlewares/validator')

exports.createQuestion = [
    body('title').isLength({min:5}).withMessage('Wir brauchen einen starken Titel'),
    body('description').isLength({min:5}).withMessage('Erzähl uns doch mehr zu deiner Frage'),
    body('category').notEmpty().isIn(['css', 'js', 'html']).withMessage('Ungültige Kategorie'),
   /*  body('user').exists().withMessage('Du musst eingeloggt sein'), */
    validator
]
