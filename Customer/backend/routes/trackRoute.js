const express = require('express')
const trackRoute = express()
const db = require('../database/connection')
trackRoute.get('/retrieve-trip-details', async (req, res)=>
{   
    const {trackingCode} = req.query

    try {
        const result = await db(`Select * from fms_g11_trips where t_trackingcode = '${trackingCode}'`)
        if(result !== 0) 
        {   
            return res.json(result)
        }
        else{
            return res.json({msg: "No Result Found!"})
        }

    } catch (error) {
        console.log(error)
        return res.json({msg: "Database is unavailable right now!"})
    }
})
module.exports = trackRoute