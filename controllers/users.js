import Users from '../models/users'
import bcrypt from 'bcryptjs'

export const register = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  try {
    const hashedPw = await bcrypt.hash(password, 10)
    const user = new Users({
      username: username,
      password: hashedPw
    })
    const queryList = await Users.find({ username: username })
    if (queryList.length === 0) {
      const saveResult = await user.save()
      console.log(saveResult)
      res.status(201).json({
        message: 'User created.',
        error: ''
      })
    } else {
      res.status(400).json({
        message: '',
        error: 'User already exist.'
      })
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500
    }
    next(error)
  }
}

export const login = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const query = await Users.findOne({ username: username })
  if (query === null) {
    res.status(400).json({
      exist: false,
      valid: true
    })
  } else {
    const validPw = bcrypt.compare(password, query.password)
    if (validPw) {
      req.session.userId = query._id
      res.status(200).json({
        exist: true,
        valid: true
      })
    } else {
      res.status(400).json({
        exist: true,
        valid: false
      })
    }
  }
}

export const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res.clearCookie('sid')
    res.status(400).json({
      error: err
    })
  })
}
