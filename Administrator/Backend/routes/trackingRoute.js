const express = require('express')
const db = require('../database/connection')
const trackingRoute = express.Router()
// All trips for admin
trackingRoute.get('/get-trips-admin', async (req, res) => {
    try {
        const tripData = await db(`
          SELECT * FROM trips WHERE t_trip_status = 'Completed' OR t_trip_status = "Cancelled"
        `);
    
        const driverData = await db("SELECT * FROM accounts");
    
        const filteredDriver = tripData.map(trip => {
          const matchingDriver = driverData.find(driver => driver.u_username === trip.t_driver);
          return matchingDriver;
        });
        res.json({ driverData: filteredDriver, tripData });
      } catch (error) {
        console.log(error);
      }
})
// status In Progress
trackingRoute.get('/get-all-trip', async (req, res) => {
    try {
      const tripData = await db(`
        SELECT * FROM trips WHERE t_trip_status = 'In Progress'
      `);
  
      const driverData = await db("SELECT * FROM accounts");
  
      const filteredDriver = tripData.map(trip => {
        const matchingDriver = driverData.find(driver => driver.u_username === trip.t_driver);
        return matchingDriver;
      });
      res.json({ driverData: filteredDriver, tripData });
    } catch (error) {
      console.log(error);
    }
  });

  // status Pending
trackingRoute.get('/get-pending-trips', async (req, res) => {
  try {
    const tripData = await db(`
      SELECT * FROM trips WHERE t_trip_status = 'Pending'
    `);

    const driverData = await db("SELECT * FROM accounts");

    const filteredDriver = tripData.map(trip => {
      const matchingDriver = driverData.find(driver => driver.u_username === trip.t_driver);
      return matchingDriver;
    });
    res.json({ driverData: filteredDriver, tripData });
  } catch (error) {
    console.log(error);
  }
});
trackingRoute.get('/get-trip', async (req, res) => {
    try {
        const {username} = req.query
        const data = await db(`SELECT * FROM trips WHERE t_driver = '${username}' AND (t_trip_status = 'Pending' OR t_trip_status = 'In Progress')`);
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.get('/get-completed-trip', async (req, res) => {
    try {
        const {username} = req.query
        const data = await db(`SELECT * FROM trips WHERE t_driver = '${username}' AND (t_trip_status = 'Completed' OR t_trip_status = 'Cancelled')`);
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.post('/update-trip/:trip_id', async (req, res) => {
    try {
        const {trip_id} = req.params
        const {status} = req.body
        const data = await db(`UPDATE trips set t_trip_status = '${status}' where t_id = ${trip_id}`)
        return res.json({message:"Delivery Status Updated!"})
    } catch (error) {
        console.log(error)
    }
})


trackingRoute.get('/get-current-trip/:trip_id', async (req, res)=>{
  try {
    const {trip_id} = req.params
    const data = await db(`SELECT * FROM trips WHERE t_id = ${trip_id}`);
    res.json(data[0])
} catch (error) {
    console.log("error")
}
})

trackingRoute.get('/get-trip-reports', async (req, res)=>{
  try {
    const data = await db(`SELECT * FROM trips`);
    res.json(data)
} catch (error) {
    console.log("error")
}
})

trackingRoute.get('/trip-search', async (req, res)=>{
  try {
    const {search} = req.query 
    const data = await db(`SELECT * FROM trips where t_trip_status LIKE '%${search}%' OR (t_driver LIKE '%${search}%' OR t_vehicle LIKE '%${search}%')`);
    res.json(data)
} catch (error) {
    console.log("error")
}
})
module.exports = trackingRoute