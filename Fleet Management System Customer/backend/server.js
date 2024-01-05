require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT
const origin = process.env.ORIGIN
var corsOptions = {
    origin: [origin],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200 
  }
app.use(express.json())
app.use(cors(corsOptions))

app.listen(port, () =>
{
    console.log(`Server Started at ${port}`)
})
const trackRoute = require('./routes/trackRoute')
app.use(trackRoute)