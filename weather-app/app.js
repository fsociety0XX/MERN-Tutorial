require('dotenv').config()
const request = require('postman-request')
const chalk = require('chalk')


const fetchUserLatLng = () => {
    request({uri: process.env.GEOCODINGMAPBOX, json: true}, (error, response) => {
        if(error) {
            console.log("Unable to connect to Weather API")
        } else if(!response.body.features.length) {
            console.log("Please enter a valid location")
        } else {
            const result = response.body
            const lng = result.features[0].center[0]
            const lat = result.features[0].center[1]
            fetchUserLocationTemp(lat,lng)
        }
    })
}

fetchUserLatLng()

const fetchUserLocationTemp = (lat,lng) => {
    request({
        uri: `${process.env.WEATHER_API}&query=${lat},${lng}`,
        json: true
    }, (error, response) => {
        console.log(response.body.current.temperature)
    })
}