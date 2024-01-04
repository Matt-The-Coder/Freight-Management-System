const express = require('express')
const trackRoute = express()
const db = require('../database/connection')
trackRoute.get('/', async (req, res)=>
{   
    res.send(`<h1>HEllo</h1>`)
})
module.exports = trackRoute