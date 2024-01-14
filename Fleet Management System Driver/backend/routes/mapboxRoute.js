const express = require('express')
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
module.exports = mapboxRoute