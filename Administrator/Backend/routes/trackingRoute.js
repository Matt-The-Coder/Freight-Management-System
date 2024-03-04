const express = require('express')
const db = require('../database/connection')
const trackingRoute = express.Router()
// All trips for admin
trackingRoute.get('/get-trips-admin', async (req, res) => {
    try {
        const tripData = await db(`
          SELECT * FROM fms_g11_trips WHERE t_trip_status = 'Completed' OR t_trip_status = "Cancelled"
        `);
    
        const driverData = await db("SELECT * FROM fms_g11_accounts");
        const sustainData = await db('Select * from fms_g11_sustainability_data')
        const filteredDriver = tripData.map(trip => {
          const matchingDriver = driverData.find(driver => driver.u_username == trip.t_driver);
          return matchingDriver;
        });
        const filteredSustain = tripData.map(trip => {
          const matchingSustain = sustainData.find(sustain => sustain.sd_trip_id == trip.t_id);
          return matchingSustain;
        });
        res.json({ driverData: filteredDriver, tripData, sustain:filteredSustain});
      } catch (error) {
        console.log(error);
      }
})
// status In Progress
trackingRoute.get('/get-all-trip', async (req, res) => {
    try {
      const tripData = await db(`
        SELECT * FROM fms_g11_trips WHERE t_trip_status = 'In Progress'
      `);
  
      const driverData = await db("SELECT * FROM fms_g11_accounts");
  
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
      SELECT * FROM fms_g11_trips WHERE t_trip_status = 'Pending'
    `);

    const driverData = await db("SELECT * FROM fms_g11_accounts");

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
        const data = await db(`SELECT * FROM fms_g11_trips WHERE t_driver = '${username}' AND (t_trip_status = 'Pending' OR t_trip_status = 'In Progress')`);
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.get('/get-completed-trip', async (req, res) => {
    try {
        const {username} = req.query
        const data = await db(`SELECT * FROM fms_g11_trips WHERE t_driver = '${username}' AND (t_trip_status = 'Completed' OR t_trip_status = 'Cancelled')`);
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.post('/update-trip/:trip_id', async (req, res) => {
    try {
        const {trip_id} = req.params
        const {status} = req.body
        const data = await db(`UPDATE fms_g11_trips set t_trip_status = '${status}' where t_id = ${trip_id}`)
        return res.json({message:"Delivery Status Updated!"})
    } catch (error) {
        console.log(error)
    }
})


trackingRoute.get('/get-current-trip/:trip_id', async (req, res)=>{
  try {
    const {trip_id} = req.params
    const data = await db(`SELECT * FROM fms_g11_trips WHERE t_id = ${trip_id}`);
    res.json(data[0])
} catch (error) {
    console.log("error")
}
})

trackingRoute.get('/get-trip-reports', async (req, res)=>{
  try {
    const data = await db(`SELECT * FROM fms_g11_trips`);
    res.json(data)
} catch (error) {
    console.log("error")
}
})

trackingRoute.get('/trip-search', async (req, res)=>{
  try {
    const {search} = req.query 
    const data = await db(`SELECT * FROM fms_g11_trips where t_trip_status LIKE '%${search}%' OR (t_driver LIKE '%${search}%' OR t_vehicle LIKE '%${search}%')`);
    res.json(data)
} catch (error) {
    console.log("error")
}
})

trackingRoute.get('/sustain-search', async (req, res)=>{
  try {
    const {search} = req.query 
    const data = await db(`SELECT * FROM fms_g11_sustainability_data where (sd_fuelcost LIKE '%${search}%' OR sd_id LIKE '%${search}%') OR (sd_carbon_emission LIKE '%${search}%' OR sd_trip_id LIKE '%${search}%')`);
    res.json(data)
} catch (error) {
    console.log("error")
}
})


trackingRoute.get('/get-all-trips', async (req, res)=>{
  try {
    const {user} = req.query
    if(user){
      const data = await db(`SELECT * FROM fms_g11_trips where t_driver = '${user}'`);
      res.json(data)
    }else{
      const data = await db(`SELECT * FROM fms_g11_trips`);
      res.json(data)
    }

} catch (error) {
    console.log(error)
}
})
module.exports = trackingRoute