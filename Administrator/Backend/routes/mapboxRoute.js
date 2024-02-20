const express = require('express')
const db = require('../database/connection')
const mapboxRoute = express.Router()
const axios = require('axios')

mapboxRoute.post("/getDirections", async (req, res) => {
    const { fLongitude, fLatitude, dLongitude, dLatitude, mapboxToken } = req.body
    try {
        const result = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${fLongitude},${fLatitude};${dLongitude},${dLatitude}?access_token=${mapboxToken}`)
        res.json(result.data)
    } catch (error) {
        console.log(error)
        res.json({ message: error })
    }

})




mapboxRoute.put("/updatePosition", async (req, res) => {
    try {
        const { trip_id, latitude, longitude, altitude, speed, heading, accuracy } = req.body
        const positionData = await db(`Select * from positions where trip_id = ${trip_id}`)
        if (positionData.length !== 0) {
            const query = `UPDATE positions set latitude = ${latitude}, longitude = ${longitude}, altitude = ${altitude}, speed = ${speed}, heading = ${heading}, accuracy = ${accuracy} where trip_id = ${trip_id}`
            const updatePosition = await db(query)
        } else {
            const insertPosition = await db(`Insert into positions (
                trip_id,
                latitude,
                longitude,
                altitude,
                speed,
                heading,
                accuracy) values (${trip_id},${latitude},${longitude},${altitude},${speed},${heading},${accuracy})`)

                res.json({message:"success"})
        }

    } catch (error) {
        console.log(error)
    }
})

mapboxRoute.get("/getPosition/:trip_id", async (req, res) => {
    try {
        const {trip_id} = req.params
        const query = `Select * from positions where trip_id = ${trip_id}`
        const positionData = await db(query)
        res.json(positionData[0])
    } catch (error) {
        console.log(error)
    }
})
module.exports = mapboxRoute