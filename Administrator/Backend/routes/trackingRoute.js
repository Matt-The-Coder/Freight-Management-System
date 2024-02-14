const express = require('express')
const db = require('../database/connection')
const trackingRoute = express.Router()
// All trips for admin
trackingRoute.get('/get-trips-admin', async (req, res) => {
    try {
        const tripData = await db(`
          SELECT * FROM trips WHERE t_trip_status = 'Completed' OR t_trip_status = "Unsuccessful"
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
        const data = await db(`SELECT * FROM trips WHERE t_driver = '${username}' AND (t_trip_status = 'Completed' OR t_trip_status = 'Unsuccessful')`);
        res.json(data)
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
        const data = await db(`UPDATE trips set t_trip_status = 'In Progress' where t_id = ${trip_id}`)
    } catch (error) {
        console.log(error)
    }
})
module.exports = trackingRoute