import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import { currentUserRouter } from './routers/current-user'
import { signinRouter } from './routers/signin'
import { signoutRouter } from './routers/signout'
import { signupRouter } from './routers/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import mongoose from 'mongoose'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to mongodb')
  } catch (err) {
    console.log(err)
  }
}

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

start()
