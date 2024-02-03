require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
const origin = process.env.ORIGIN
const http = require('http');
const { Server } = require('socket.io')
const path = require('path')
const db = require('./database/connection')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const VITE_MAPBOX_API = "pk.eyJ1Ijoibm9haGtseWRlMTciLCJhIjoiY2xvZTF3djYwMDczdTJtcGY3dXdibHR4aSJ9.0VgWjkWc6WcgV4DarLZTGw"
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'images')))

const server = http.createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: [origin],
      methods: ["POST", "GET", "DELETE", "PUT"]
    }
  })
app.use(session({
  secret: 'secret-lang-po-ito',
  resave: false,
  saveUninitialized: true,
  proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
  name: 'MyKargadaOnly', // This needs to be unique per-host.
  cookie: {
    secure: true, // required for cookies to work on HTTPS
    httpOnly: false,
    sameSite: 'none'
  }
}))

var corsOptions = {
  origin: [origin],
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
const maintenanceRouter = require('./routes/maintenanceRoute')
const fuelRoute = require('./routes/fuelRoute')
const authRoute = require('./routes/authRoute');
const mapboxRoute = require('./routes/mapboxRoute')
const weatherAndFuelRoute = require('./routes/weatherAndFuelRoute')
const personalInfoRoute = require('./routes/personalInfoRoute')

app.use(authRoute)
app.use(fuelRoute)
app.use(maintenanceRouter)
app.use(weatherAndFuelRoute)
app.use(mapboxRoute)
app.use(personalInfoRoute)

io.on('connection', async (socket) =>  {

  console.log(`User connected ${socket.id}`);
    const messages = await db("Select * from message limit 100")
    socket.emit('last_100_messages', messages)

    socket.on('send_message', async (data) => {
      const {  username, role, message, __createdtime__ , picture} = data;
      await db(`Insert into message (username, role, message, timesent, prof_pic ) values('${username}', '${role}', '${message}', ${__createdtime__}, '${picture}')`)
      io.emit('receive_message', data); // Send Back to the sender
  })

  


});
server.listen(port, async () => {
  console.log(`Server started at port ${port}`)

})
