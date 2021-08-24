const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const taskRoute = require('./routes/task')
const userRoute = require('./routes/user')
require('./db/mongoose')

// app.use((req, res, next) => {
//     res.status(503).send('Server is under maintainance please try back soon')
// })
app.use(express.json())
app.use(taskRoute)
app.use(userRoute)

app.listen(port, () => {
    console.log("Listening on " + port)
})
