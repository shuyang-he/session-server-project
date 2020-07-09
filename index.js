import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import users from './routes/users'

const cookieAge = 60 * 60 * 1000
const PORT = 8000
const app = express()
app.use(bodyParser.json())
app.use(session({
  secret: 'project 1 server',
  resave: false,
  saveUninitialized: false,
  name: 'sid',
  cookie: { maxAge: cookieAge }
}))

const mongoURI = 'mongodb://localhost:27017/project1'
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoCreate: true,
  autoIndex: false
}

app.use('/api/users', users)

mongoose
  .connect(mongoURI, connectOptions, (err, db) => {
    if (err) {
      throw err
    }
    console.log('Connect to MongoDB')
  })
  .then((res) => {
    return app.listen(PORT, () => {
      console.log('Server started on port', PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  })
