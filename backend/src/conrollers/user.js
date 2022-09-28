const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')

/** @type {import("express").RequestHandler} */
exports.logout = async (req, res) => {
 /*  throw new Error('not implemented') */
 const token = req.cookies['user-token']
 const user = await User.findOne().where('token').equals(token)

 if(user){
   user.token = ''
   await user.save()
 }
 res.cookie('user-token', '', { maxAge: 1, sameSite: 'strict', httpOnly: true })

 res.status(200).send()

}

/** @type {import("express").RequestHandler} */
exports.register = async (req, res) => {
  
    const user = new User(req.body)
    user.password = await bcrypt.hash(user.password, 10)
    user.token = crypto.randomBytes(64).toString('hex')

    
  // req.file.path: "/uploads/asfkhqfklhqf.jpg"
  // process.cwd(): "C://manuelJung/projects/deq-min-project/backend"
  // -> C://manuelJung/projects/deq-min-project/backend/uploads/asfkhqfklhqf.jpg
  // buffer: 68656c6c6f20776f726c64
  if(req.file) {
		const filename = path.join(process.cwd(), req.file.path)
		const buffer = await fs.readFile(filename);
		const image = `data:${req.file.mimetype};base64,${buffer.toString("base64")}`;
		user.profileImage = image;
		await fs.unlink(filename);
  }
    

    await user.save()

    
    res.cookie('user-token', user.token, { maxAge: 900000, sameSite: 'strict', httpOnly: true })

    res.status(200).send(user)
}

/** @type {import("express").RequestHandler} */
exports.login = async (req, res, next) => {
   const {email, password} = req.body

   const user = await User.findOne().where('email').equals(email)

   if(!user) {
     const error = new Error('Diese Email kennen wir nicht')
     error.status = 400
     return next(error)
   }

   const passwordIsCorrect = await bcrypt.compare(password, user.password)

   if(!passwordIsCorrect) {
     const error = new Error('Passwort nicht korrekt')
     error.status = 401
     return next(error)
   }

   user.token = crypto.randomBytes(64).toString('hex')
   await user.save()

   res.cookie('user-token', user.token, { maxAge: 900000, sameSite: 'strict', httpOnly: true })

   res.status(200).send(user)
}

/** @type {import("express").RequestHandler} */
exports.getCurrentUser = async (req, res) => {
  const token = req.cookies['user-token']

  if(!token) {
    return res.status(200).json(null)
  }

  const user = await User.findOne().where('token').equals(token)

  return res.status(200).json(user)
}

/** @type {import("express").RequestHandler} */
exports.updateUser = async (req, res) => {
  const {name} = req.body

  const user = req.user
  user.name = name

  if(req.file) {
    const filename = path.join(process.cwd(), req.file.path)
		const buffer = await fs.readFile(filename);
		const image = `data:${req.file.mimetype};base64,${buffer.toString("base64")}`;
		user.profileImage = image;
		await fs.unlink(filename);
  }

  await user.save()

  res.status(200).send(user)
}