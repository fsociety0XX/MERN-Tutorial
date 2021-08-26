require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const taskRoute = require('./routes/task')
const userRoute = require('./routes/user')
require('./db/mongoose')


app.use(express.json())
app.use(taskRoute)
app.use(userRoute)

app.listen(port, () => {
    console.log("Listening on " + port)
})
