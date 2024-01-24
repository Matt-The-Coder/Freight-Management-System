require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
const origin = process.env.ORIGIN
const axios = require('axios')
const multer = require('multer')
const path = require('path')
const cors = require('cors') 
const cookieParser = require('cookie-parser')
const session = require('express-session')
const VITE_MAPBOX_API = "pk.eyJ1Ijoibm9haGtseWRlMTciLCJhIjoiY2xvZTF3djYwMDczdTJtcGY3dXdibHR4aSJ9.0VgWjkWc6WcgV4DarLZTGw"
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'images')))
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
  name: 'MyCoolWebAppCookieName', // This needs to be unique per-host.
  cookie: {
    secure: false, // required for cookies to work on HTTPS
    httpOnly: false,
    sameSite: 'none'
  }
}))
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true
// }))
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true,
//   proxy: true,
//   name: 'MyCustomCookieName',
//   cookie: {
//     secure: false,
//     httpOnly: true,
//     sameSite: 'lax'
//   }
// }));
var corsOptions = {
    origin: [origin],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200 
  }
const maintenanceRouter = require('./routes/maintenanceRoute')
const fuelRoute = require('./routes/fuelRoute')
const authRoute = require('./routes/authRoute');
const mapboxRoute = require('./routes/mapboxRoute')
const weatherAndFuelRoute = require('./routes/weatherAndFuelRoute')
const personalInfoRoute = require('./routes/personalInfoRoute')
app.use(cors(corsOptions))
app.use(authRoute)
app.use(fuelRoute)
app.use(maintenanceRouter)
app.use(weatherAndFuelRoute)
app.use(mapboxRoute)
app.use(personalInfoRoute)

app.listen(port, ()=>{

    console.log(`Server started at port ${port}`)

})
