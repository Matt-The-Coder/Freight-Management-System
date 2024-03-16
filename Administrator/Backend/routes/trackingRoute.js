const express = require('express')
const db = require('../database/connection')
const trackingRoute = express.Router()
// All trips for admin
trackingRoute.get('/get-trips-admin', async (req, res) => {
    try {
        const tripData = await db(`
          SELECT * FROM fms_g11_trips INNER JOIN fms_g12_drivers ON t_driver = d_id
          INNER JOIN fms_g11_sustainability_data on t_id = sd_trip_id
          WHERE t_trip_status = 'Completed' OR t_trip_status = "Cancelled"
        `);
    
        res.json(tripData);
      } catch (error) {
        console.log(error);
      }
})
// status In Progress
trackingRoute.get('/get-all-trip', async (req, res) => {
    try {
      const tripData = await db(`
      SELECT * FROM fms_g11_trips INNER JOIN fms_g12_drivers on t_driver = d_id WHERE t_trip_status = 'In Progress'
      `);
  
      res.json( tripData );
    } catch (error) {
      console.log(error);
    }
  });

  // status Pending
trackingRoute.get('/get-pending-trips', async (req, res) => {
  try {
    const tripData = await db(`
      SELECT * FROM fms_g11_trips INNER JOIN fms_g12_drivers on t_driver = d_id WHERE t_trip_status = 'Pending'
    `);
    res.json(tripData);
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
        const data = await db(`SELECT * FROM fms_g11_trips INNER JOIN  fms_g12_drivers ON 
        fms_g11_trips.t_driver = fms_g12_drivers.d_id
        WHERE t_driver = '${username}' AND (t_trip_status = 'Completed' OR t_trip_status = 'Cancelled')`);
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

trackingRoute.post('/update-trip/:trip_id', async (req, res) => {
    try {
        const {trip_id} = req.params
        const {status, report} = req.body
        const data = await db(`UPDATE fms_g11_trips set t_trip_status = '${status}', t_remarks = '${report?report:'N/A'}' where t_id = ${trip_id}`)
        if(status == "Completed"){
          return res.json({message:"Delivery has been Completed!"})
        }else if(status == "Cancelled"){
          return res.json({message:"Delivery has been Cancelled!"})
        }else{
          return res.json({message:"Delivery has been Updated!"})
        }

    } catch (error) {
        console.log(error)
    }
})


trackingRoute.get('/get-current-trip/:trip_id', async (req, res)=>{
  try {
    const {trip_id} = req.params
    const data = await db(`SELECT *, d_first_name, d_last_name FROM fms_g11_trips 
INNER JOIN fms_g12_drivers on fms_g11_trips.t_driver = fms_g12_drivers.d_id where t_id = '${trip_id}'`);
    res.json(data[0])
} catch (error) {
    console.log(error)
}
})

trackingRoute.get('/get-trip-reports', async (req, res)=>{
  try {
    const data = await db(`SELECT * FROM fms_g11_trips`);
    res.json(data)
} catch (error) {
    console.log(error)
}
})

trackingRoute.get('/trip-search', async (req, res)=>{
  try {
    const {search} = req.query 
    const data = await db(`SELECT * FROM fms_g11_trips where t_trip_status LIKE '%${search}%' OR (t_driver LIKE '%${search}%' OR t_vehicle LIKE '%${search}%')`);
    res.json(data)
} catch (error) {
    console.log(error)
}
})

trackingRoute.get('/sustain-search', async (req, res)=>{
  try {
    const {search} = req.query 
    const data = await db(`SELECT * FROM fms_g11_sustainability_data where (sd_fuelcost LIKE '%${search}%' OR sd_id LIKE '%${search}%') OR (sd_carbon_emission LIKE '%${search}%' OR sd_trip_id LIKE '%${search}%')`);
    res.json(data)
} catch (error) {
    console.log(error)
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