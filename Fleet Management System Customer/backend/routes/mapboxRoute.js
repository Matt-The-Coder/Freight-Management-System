const express = require('express')
const db = require('../database/connection')
const mapboxRoute = express.Router()
const axios = require('axios')

mapboxRoute.post("/getDirections", async (req, res) => 
{  
    const {fLongitude, fLatitude, dLongitude, dLatitude,mapboxToken} = req.body
    try {
    const result = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${fLongitude},${fLatitude};${dLongitude},${dLatitude}?access_token=${mapboxToken}`)
    res.json(result.data)
} catch (error) {
    res.json({message: "error pre"})
}

})


mapboxRoute.get("/getTrip", async (req, res) => 
{
    try {
        const result = await db("Select * from trips")
        if(result !== 0){
            res.json(result[0])
        }
    } catch (error) {
        console.log(error)
    }

})


mapboxRoute.put("/updatePosition", async (req, res) => 
{
    try {
        const {latitude, longitude, altitude, speed, heading, accuracy} = req.body
        const query = `UPDATE positions set latitude = ${latitude}, longitude = ${longitude}, altitude = ${altitude}, speed = ${speed}, heading = ${heading}, accuracy = ${accuracy}`
        const updatePosition = await db(query)
    } catch (error) {
        console.log(error)
    }
})

mapboxRoute.get("/getPosition", async (req, res) => 
{
    try {
        const query = "Select * from positions"
        const positionData = await db(query)
        res.json(positionData[0])
    } catch (error) {
        console.log(error)
    }
})
module.exports = mapboxRoute