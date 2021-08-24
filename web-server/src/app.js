require('dotenv').config()
const express = require('express')
const request = require('postman-request')
const path = require('path')
const app = express()
const file = path.join(__dirname,'./public')

app.use(express.static(file))

app.get('/weather', async (req, res) => {
    console.log(req.query,"00000")
    if(Object.keys(req.query).length) {
        const {lat, lng} = req.query
        request({
            uri: `${process.env.WEATHER_API}&query=${lat},${lng}`,
            json: true
        }, (error, response) => {
            res.send(`Temp is ${response.body.current.temperature}`)
        })
    } else {
        res.send('Please provide lat and lng')
    }
})

app.get('', (req, res) => {
    res.send('Welcome')
})

app.get('/about', (req, res) => {
    res.send('About section')
})

app.listen(4001, () => console.log("server is running at 4001"))