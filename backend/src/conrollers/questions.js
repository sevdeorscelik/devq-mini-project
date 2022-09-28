const Question = require("../models/Question")


/** @type {import("express").RequestHandler} */
exports.getQuestionList = async (req, res) => {
  const category = req.query.category
  const search = req.query.search

  let dbQuery = Question.find()

  if(category) {
    dbQuery = dbQuery.where('category').equals(category)
  }

  if(search) {
    dbQuery = dbQuery.or([
      {"title": {$regex: search, $options: "i"}},
      {"description": {$regex: search, $options: "i" }}
    ])
  }

  const questions = await dbQuery.populate('user', 'name profileImage')

  res.status(200).send(questions)
}

/** @type {import("express").RequestHandler} */
exports.getQuestionsById = async (req, res, next) => {
  const id = req.params.id
  const question = await Question.findById(id).populate('user', 'name profileImage').populate('answers', 'user description') // 1

  await Promise.all(question.answers.map(async answer => {
	await answer.populate("user", "name profileImage"); // 2
  }))

  /* Ergebnisbeispiel:
  {
	title: "...", // 1
	description: "...". // 1
	user: { name: "... "}, // 1 Populate "user"
	answers: [ // 1 Populate "answers"
		{
			description: "...",
			user: { name: "..."} // 2 Populate "user"
		}
		{
			description: "...",
			user: { name: "..."} // 2 Populate "user"
		}
	]
  }
  */

  if(!question) {
    const error = new Error('diese Question-ID gibt es nicht')
    error.status = 400
    return next(error)
  }

  res.status(200).send(question)
}

/** @type {import("express").RequestHandler} */
exports.createQuestion = async (req, res) => {
  const question = new Question(req.body)
  question.user = req.user._id
  await question.save()
  res.status(200).send(question)
}