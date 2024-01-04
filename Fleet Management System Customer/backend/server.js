require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
app.use(express.json())
app.listen(port, () =>
{
    console.log(`Server Started at ${port}`)
})
const trackRoute = require('./routes/trackRoute')
app.use(trackRoute)