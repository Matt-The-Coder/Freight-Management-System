const express = require('express')
const db = require('../database/connection')
const trackingRoute = express.Router()

trackingRoute.get('/get-trip', async (req, res) => {
    try {
        const {username} = req.query
        const data = await db(`Select * from trips where t_driver = '${username}' && t_trip_status = 'YetToStart' `)
        return  res.json(data)
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.post('/update-trip/:trip_id', async (req, res) => {
    try {
        const {trip_id} = req.params
        const {status} = req.body
        console.log(status)
        const data = await db(`UPDATE trips set t_trip_status = '${status}' where t_id = ${trip_id}`)
        return res.json({message:"Delivery Completed!"})
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.post('/update-trip-status/:trip_id', async (req, res) => {
    try {
        const {trip_id} = req.params
        const data = await db(`UPDATE trips set t_trip_status = 'OnGoing' where t_id = ${trip_id}`)
    } catch (error) {
        console.log(error)
    }
})
module.exports = trackingRoute